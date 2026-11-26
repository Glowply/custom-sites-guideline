<?php
// Marsa test store: media, grind attribute, categories, products. Re-runnable: ids live in option marsa_build.
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$dir = getenv("HOME") . "/marsa-upload"; // photos + alts.json copied here first
$alts = json_decode(file_get_contents("$dir/alts.json"), true);
$st = get_option('marsa_build', []) ?: [];
$st['media'] = $st['media'] ?? [];

// 1. media
foreach (glob("$dir/*.{png,jpg}", GLOB_BRACE) as $f) {
    $key = basename($f);
    if (!empty($st['media'][$key]) && get_post($st['media'][$key])) continue;
    $role = preg_replace('/(-photo)?\.(png|jpg)$/', '', $key);
    $tmp = wp_tempnam($key); copy($f, $tmp);
    $id = media_handle_sideload(['name' => 'marsa-' . $key, 'tmp_name' => $tmp], 0, 'مرسى · ' . $role);
    if (is_wp_error($id)) { echo "media $key: " . $id->get_error_message() . "\n"; continue; }
    $alt = $alts[$role]['alt'] ?? '';
    update_post_meta($id, '_wp_attachment_image_alt', $alt);
    update_post_meta($id, '_glowply_photo_credit', 'Pixabay · ' . ($alts[$role]['credit'] ?? ''));
    $st['media'][$key] = $id;
}
update_option('marsa_build', $st, false);

// 2. grind attribute
$grinds = ['whole' => 'حبّ', 'turkish' => 'تركي ناعم جدًا', 'espresso' => 'إسبريسو', 'filter' => 'فلتر وV60', 'press' => 'فرنش بريس'];
if (!wc_attribute_taxonomy_id_by_name('grind')) {
    $r = wc_create_attribute(['name' => 'الطحنة', 'slug' => 'grind', 'type' => 'select', 'order_by' => 'menu_order', 'has_archives' => false]);
    if (is_wp_error($r)) { echo 'attr: ' . $r->get_error_message() . "\n"; return; }
}
if (!taxonomy_exists('pa_grind')) register_taxonomy('pa_grind', 'product', ['hierarchical' => false]);
$i = 0;
foreach ($grinds as $slug => $name) {
    $t = get_term_by('slug', $slug, 'pa_grind');
    $tid = $t ? $t->term_id : wp_insert_term($name, 'pa_grind', ['slug' => $slug])['term_id'];
    update_term_meta($tid, 'order', $i++);
}

// 3. categories
$cats = ['turkish' => 'بن تركي', 'origins' => 'بن من بلاد بعيدة', 'espresso' => 'إسبريسو', 'tools' => 'أدوات'];
$catId = []; $i = 0;
foreach ($cats as $slug => $name) {
    $t = get_term_by('slug', $slug, 'product_cat');
    $catId[$slug] = $t ? $t->term_id : wp_insert_term($name, 'product_cat', ['slug' => $slug])['term_id'];
    update_term_meta($catId[$slug], 'order', $i++);
}

// 4. products (order = light to dark on the shelf, then tools)
$coffees = [
  ['eth', 'إثيوبي سيدامو', 'origins', 560, 'filter', 'إثيوبيا · ٢٥٠ جم', 'تحميص فاتح', 'ليمون، شاي، عسل', 'بن فاتح، ريحته ليمون وطعمه زي الشاي بعسل. أحلى في V60 أو فلتر.', 'p_ethiopia', 1],
  ['col', 'كولومبي', 'origins', 480, 'whole', 'كولومبيا · ٢٥٠ جم', 'تحميص وسط', 'كراميل، شيكولاتة بلبن، تفاح', 'بن متوازن ينفع في أي طريقة: إسبريسو، فلتر، أو فرنش بريس.', 'p_colombia', 2],
  ['tplain', 'بن تركي سادة', 'turkish', 210, 'turkish', 'خلطة برازيلي وكولومبي · ٢٥٠ جم', 'تحميص وسط', 'مكسرات، كراميل', 'نفس الخلطة من غير حبهان، لو بتحب تضيف على مزاجك.', 'p_turkish_plain', 3],
  ['bra', 'برازيلي', 'origins', 420, 'whole', 'البرازيل · ٢٥٠ جم', 'تحميص وسط لغامق', 'مكسرات، كاكاو، حموضة قليلة', 'بن ناعم الطعم وحموضته قليلة، ينفع لو لسه بتجرب برّه البن التركي.', 'p_brazil', 4],
  ['tspiced', 'بن تركي محوّج', 'turkish', 230, 'turkish', 'خلطة برازيلي وكولومبي · ٢٥٠ جم', 'تحميص وسط لغامق', 'حبهان، شيكولاتة غامقة', 'البن التركي اللي أغلب الناس بتطلبه: محمّص وسط لغامق ومطحون ناعم جدًا، والحبهان مطحون معاه طازة.', 'p_turkish_spiced', 5],
  ['esp', 'خلطة إسبريسو «المينا»', 'espresso', 1450, 'espresso', 'برازيلي وإثيوبي · ١ كيلو', 'تحميص وسط لغامق', 'شيكولاتة غامقة، بندق', 'خلطة إسبريسو بالكيلو للكافيهات واللي عنده مكنة في البيت. بتطلع كريمة تقيلة مع اللبن.', 'p_espresso', 6],
  ['tdark', 'بن تركي غامق', 'turkish', 220, 'turkish', 'برازيلي · ٢٥٠ جم', 'تحميص غامق', 'كاكاو، مُر خفيف', 'تحميصة أغمق للي بيحب الفنجان تقيل ومُرّه واضح.', 'p_turkish_dark', 7],
];
$tools = [
  ['cezve', 'كنكة نحاس', 380, 'مقاس ٣ فناجين، يد خشب', 'كنكة نحاس بيد خشب، تعمل ٣ فناجين. النحاس بيوزّع الحرارة فالوش بيطلع حلو.', 'p_cezve', 8],
  ['dripper', 'قمع تقطير سيراميك', 450, 'لفلاتر الورق المخروطية، فنجان أو اتنين', 'قمع سيراميك للقهوة المقطّرة. بيشتغل بفلاتر الورق المخروطية، والفلاتر مش معاه.', 'p_dripper', 9],
];
$st['products'] = $st['products'] ?? [];
$attrId = wc_attribute_taxonomy_id_by_name('grind');
foreach ($coffees as [$k, $name, $cat, $price, $def, $origin, $roast, $notes, $desc, $photo, $order]) {
    if (!empty($st['products'][$k]) && wc_get_product($st['products'][$k])) continue;
    $p = new WC_Product_Variable();
    $p->set_name($name); $p->set_status('publish'); $p->set_menu_order($order);
    $p->set_short_description($desc); $p->set_category_ids([$catId[$cat]]);
    $p->set_image_id($st['media']["$photo.png"]); $p->set_gallery_image_ids([$st['media']["$photo-photo.jpg"]]);
    $a = new WC_Product_Attribute(); $a->set_id($attrId); $a->set_name('pa_grind');
    $a->set_options(array_map(fn($s) => get_term_by('slug', $s, 'pa_grind')->term_id, array_keys($grinds)));
    $a->set_visible(true); $a->set_variation(true);
    $p->set_attributes([$a]); $p->set_default_attributes(['pa_grind' => $def]);
    $pid = $p->save();
    foreach (array_keys($grinds) as $g) {
        $v = new WC_Product_Variation(); $v->set_parent_id($pid);
        $v->set_attributes(['pa_grind' => $g]); $v->set_regular_price((string) $price); $v->set_status('publish'); $v->save();
    }
    WC_Product_Variable::sync($pid);
    update_post_meta($pid, '_marsa_origin', $origin);
    update_post_meta($pid, '_marsa_roast', $roast);
    update_post_meta($pid, '_marsa_notes', $notes);
    $st['products'][$k] = $pid;
}
foreach ($tools as [$k, $name, $price, $detail, $desc, $photo, $order]) {
    if (!empty($st['products'][$k]) && wc_get_product($st['products'][$k])) continue;
    $p = new WC_Product_Simple();
    $p->set_name($name); $p->set_status('publish'); $p->set_menu_order($order); $p->set_regular_price((string) $price);
    $p->set_short_description($desc); $p->set_category_ids([$catId['tools']]);
    $p->set_image_id($st['media']["$photo.png"]); $p->set_gallery_image_ids([$st['media']["$photo-photo.jpg"]]);
    $pid = $p->save();
    update_post_meta($pid, '_marsa_origin', $detail);
    $st['products'][$k] = $pid;
}
$st['cats'] = $catId;
update_option('marsa_build', $st, false);
echo wp_json_encode($st, JSON_UNESCAPED_UNICODE), "\n";
echo 'currency: ', get_option('woocommerce_currency'), ' ', get_option('woocommerce_currency_pos'), ' decimals ', get_option('woocommerce_price_num_decimals'), "\n";
