// Speed experiments on slow 4G (same profile as custom-sites/tools/speed.mjs), with rewrites to find what delays LCP.
//   node probe.mjs <url> <variant> [runs]
// variants: base | nofilter (strip stamp SVG filters) | notex (drop SVG noise backgrounds) | nofont (block font files)
//           | noplug (block non-essential plugin CSS/JS) | all
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
// Chrome: set CHROME to override.
const CHROME = process.env.CHROME || { win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }[process.platform] || 'google-chrome';
const [url, variant = 'base', runs = '3'] = process.argv.slice(2);
const V = new Set(variant === 'all' ? ['nofilter', 'notex', 'nofont', 'noplug'] : variant.split('+'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'probe-'));
const proc = spawn(CHROME, [`--user-data-dir=${profile}`, '--headless=new', '--remote-debugging-port=0', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 100 && !ws; i++) { const f = path.join(profile, 'DevToolsActivePort'); if (fs.existsSync(f)) { const [p, w] = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/); if (w) ws = `ws://127.0.0.1:${p}${w}`; } await sleep(100); }
const sock = new WebSocket(ws); await new Promise((r) => (sock.onopen = r));
let id = 0; const pend = new Map(); const listeners = new Set();
sock.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else listeners.forEach((l) => l(d)); };
const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pend.set(i, r); sock.send(JSON.stringify({ id: i, method, params, sessionId })); });
const PLUG = ['kashier', 'analyticswp', 'glowply-pixels', 'glowply-assistant', 'trp-', 'glowply-translate', 'bosta', 'cdn-cgi', 'wc-blocks', 'woocommerce-subscriptions'];
const results = [];
for (let run = 0; run < +runs; run++) {
  const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);
  await s('Network.enable'); await s('Page.enable'); await s('Runtime.enable');
  await s('Network.setCacheDisabled', { cacheDisabled: true });
  await s('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await s('Emulation.setCPUThrottlingRate', { rate: 4 });
  await s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  const blocked = [];
  if (V.has('nofont')) blocked.push('*.woff2', '*.woff', '*fonts.googleapis*', '*fonts.gstatic*');
  if (V.has('noplug')) PLUG.forEach((p) => blocked.push(`*${p}*`));
  if (blocked.length) await s('Network.setBlockedURLs', { urls: blocked });
  const rewrite = V.has('nofilter') || V.has('notex');
  if (rewrite) await s('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Response', resourceType: 'Document' }, { urlPattern: '*.css*', requestStage: 'Response' }] });
  const reqs = new Map();
  const l = async (d) => {
    if (d.sessionId !== sessionId) return;
    if (d.method === 'Network.responseReceived') reqs.set(d.params.requestId, { url: d.params.response.url, type: d.params.type, t: d.params.response.timing });
    if (d.method === 'Network.loadingFinished') { const r = reqs.get(d.params.requestId); if (r) { r.end = d.params.timestamp; r.bytes = d.params.encodedDataLength; } }
    if (d.method === 'Fetch.requestPaused') {
      const p = d.params;
      const body = await s('Fetch.getResponseBody', { requestId: p.requestId });
      let txt = body.result.base64Encoded ? Buffer.from(body.result.body, 'base64').toString('utf8') : body.result.body;
      if (V.has('nofilter')) txt = txt.replace(/ filter="url\(#mr-rough-\d+\)"/g, '');
      if (V.has('notex')) txt = txt.replace(/url\(\\?"?data:image\/svg\+xml,%3Csvg[^)]*feTurbulence[^)]*\)/g, 'none').replace(/var\(--mr-(ink-tex|fibre)\)/g, 'none');
      await s('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: p.responseStatusCode || 200, responseHeaders: (p.responseHeaders || []).filter((h) => !/content-length|content-encoding/i.test(h.name)), body: Buffer.from(txt, 'utf8').toString('base64') });
    }
  };
  listeners.add(l);
  await s('Page.addScriptToEvaluateOnNewDocument', { source: `window.__lcp=0;window.__lcpEl='';new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__lcp=e.startTime;window.__lcpEl=(e.element?e.element.tagName+'.'+String(e.element.className).slice(0,40):'')+' '+(e.url||'').split('/').pop()}}).observe({type:'largest-contentful-paint',buffered:true});` });
  await s('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'nc=' + Date.now() });
  for (let i = 0; i < 600; i++) { const r = await s('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }); if (r.result?.result?.value === 'complete') break; await sleep(100); }
  await sleep(4000);
  const ev = async (e) => (await s('Runtime.evaluate', { expression: e, returnByValue: true })).result.result.value;
  const lcp = await ev('window.__lcp'), el = await ev('window.__lcpEl');
  const fcp = await ev("(performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime");
  const nav = await ev('JSON.stringify(performance.getEntriesByType("navigation")[0])');
  const res = await ev(`JSON.stringify(performance.getEntriesByType('resource').filter(r=>r.renderBlockingStatus==='blocking'||/marsa-hero|woff|gstatic/.test(r.name)).map(r=>[r.name.replace(location.origin,'').slice(0,70),Math.round(r.startTime),Math.round(r.responseEnd),Math.round(r.transferSize/1024)]))`);
  listeners.delete(l);
  const n = JSON.parse(nav);
  results.push({ lcp: Math.round(lcp), fcp: Math.round(fcp), ttfb: Math.round(n.responseStart), domInteractive: Math.round(n.domInteractive), el, blocking: JSON.parse(res) });
  await send('Target.closeTarget', { targetId });
}
sock.close(); proc.kill();
const med = (k) => results.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(results.length / 2)];
console.log(JSON.stringify({ variant, lcp: med('lcp'), fcp: med('fcp'), ttfb: med('ttfb'), domInteractive: med('domInteractive'), lcps: results.map((r) => r.lcp), el: results[0].el }));
if (process.env.SHOW_BLOCKING) console.log(JSON.stringify(results[0].blocking, null, 0));
