// Prints the WP-CLI command (everything after "wp") that runs one Breakdance ability on a store or subsite.
// Pass the output to the store's wp-cli tool (Agent Connector).
//
//   node run-ability.js <ability-name> <params.json | -> <site-url> [admin-login]
//   node run-ability.js breakdance/site-info - https://client-store.myglowply.com/
//   node run-ability.js breakdance/site-info - https://glowplylibrary.com/my-design/
//
// The params travel base64-encoded so Arabic text and quotes survive the shell.
const fs = require('fs');
const [ability, file, url, user = 'glowply'] = process.argv.slice(2);
if (!ability || !url) {
  console.error('usage: node run-ability.js <ability> <params.json|-> <site-url> [admin-login]');
  process.exit(1);
}
const raw = !file || file === '-' ? '{}' : fs.readFileSync(file, 'utf8');
const b64 = Buffer.from(JSON.stringify(JSON.parse(raw)), 'utf8').toString('base64');
const php = [
  '$p = json_decode(base64_decode("' + b64 + '"), true);',
  '$a = wp_get_ability("' + ability + '");',
  'if (!$a) { echo wp_json_encode(["error" => "no such ability on this site"]); return; }',
  '$r = $a->execute($p ?: []);',
  'echo wp_json_encode(is_wp_error($r) ? ["error" => $r->get_error_message(), "code" => $r->get_error_code(), "data" => $r->get_error_data()] : $r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);',
].join(' ');
process.stdout.write('--url=' + url + ' --user=' + user + " eval '" + php + "'");
