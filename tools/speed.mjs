// Loads each URL in headless Chrome as a phone on slow 4G (Lighthouse's mobile preset:
// 150 ms RTT, 1.6 Mbps down, 750 kbps up, 4x CPU slowdown) and reports bytes by type and LCP.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const urls = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'speed-'));
const proc = spawn(CHROME, [`--user-data-dir=${profile}`, '--headless=new', '--remote-debugging-port=0', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 100 && !ws; i++) {
  const f = path.join(profile, 'DevToolsActivePort');
  if (fs.existsSync(f)) { const [p, w] = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/); if (w) ws = `ws://127.0.0.1:${p}${w}`; }
  await sleep(100);
}
const sock = new WebSocket(ws);
await new Promise((r) => (sock.onopen = r));
let id = 0; const pend = new Map(); const listeners = new Set();
sock.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else listeners.forEach((l) => l(d)); };
const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pend.set(i, r); sock.send(JSON.stringify({ id: i, method, params, sessionId })); });

for (const url of urls) {
  const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);
  await s('Network.enable'); await s('Page.enable'); await s('Runtime.enable');
  await s('Network.setCacheDisabled', { cacheDisabled: true });
  await s('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await s('Emulation.setCPUThrottlingRate', { rate: 4 });
  await s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  const req = new Map(); const bytes = {};
  const l = (d) => {
    if (d.sessionId !== sessionId) return;
    if (d.method === 'Network.responseReceived') req.set(d.params.requestId, d.params.type);
    if (d.method === 'Network.loadingFinished') { const t = req.get(d.params.requestId) || 'Other'; bytes[t] = (bytes[t] || 0) + d.params.encodedDataLength; }
  };
  listeners.add(l);
  await s('Page.addScriptToEvaluateOnNewDocument', { source: `window.__lcp=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});` });
  const t0 = Date.now();
  await s('Page.navigate', { url });
  // wait for load, then let late images/fonts finish
  for (let i = 0; i < 600; i++) { const r = await s('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }); if (r.result?.result?.value === 'complete') break; await sleep(100); }
  const loadMs = Date.now() - t0;
  await sleep(4000);
  const lcp = (await s('Runtime.evaluate', { expression: 'window.__lcp', returnByValue: true })).result.result.value;
  listeners.delete(l);
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const kb = (n) => Math.round((n || 0) / 1024);
  console.log(JSON.stringify({ url, lcp_s: +(lcp / 1000).toFixed(2), load_s: +(loadMs / 1000).toFixed(1), total_kb: kb(total), image_kb: kb(bytes.Image), font_kb: kb(bytes.Font), doc_kb: kb(bytes.Document), css_kb: kb(bytes.Stylesheet), js_kb: kb(bytes.Script) }));
  await send('Target.closeTarget', { targetId });
}
sock.close(); proc.kill();
