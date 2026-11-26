<?php
/**
 * Runs one WordPress ability (Breakdance's breakdance/*, Glowply's glowply/*) on the store this WP-CLI runs in.
 * Read by ssh-ability.sh through `wp eval-file -`; the ability name and its params arrive in environment variables,
 * so Arabic text, quotes and backslashes never pass through a shell.
 */
$name = getenv('AB_NAME');
$params = json_decode(base64_decode(getenv('AB_PARAMS') ?: 'e30='), true) ?: [];
$ability = wp_get_ability($name);
if (!$ability) {
    echo wp_json_encode(['error' => "no ability $name on this site (is GLOWPLY_ALLOW_AGENTS set in wp-config.php?)"]);
    return;
}
$r = $ability->execute($params);
echo wp_json_encode(is_wp_error($r) ? ['error' => $r->get_error_message(), 'data' => $r->get_error_data()] : $r,
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
