const fs = require('fs');
const U = 'https://sadasdtest.myglowply.com/wp-content/uploads/2026/11/marsa-';
let n = 0;
function stamp(cls, label) {
  n++;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="mr-stamp ${cls}" viewBox="0 0 200 200" ${aria}><defs><filter id="mr-rough-${n}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="2" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="1" seed="4" result="speck"/><feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="holes"/><feComposite in="d" in2="holes" operator="in" result="inked"/><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="1" seed="2" result="press"/><feColorMatrix in="press" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.55" result="pressure"/><feComposite in="inked" in2="pressure" operator="in"/></filter><path id="mr-ring-${n}" d="M 100,100 m -79,0 a 79,79 0 1,1 158,0 a 79,79 0 1,1 -158,0"/></defs><g filter="url(#mr-rough-${n})"><circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" stroke-width="2.5"/><text font-family="Almarai, sans-serif" font-weight="700" font-size="19" fill="currentColor"><textPath href="#mr-ring-${n}" startOffset="25%" text-anchor="middle">محمصة بن · إسكندرية</textPath></text><circle cx="21" cy="100" r="3" fill="currentColor"/><circle cx="179" cy="100" r="3" fill="currentColor"/><text x="100" y="104" text-anchor="middle" font-family="Lalezar, sans-serif" font-size="50" fill="currentColor">مرسى</text><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="100" cy="117" r="4"/><path d="M100 121 V151"/><path d="M90 128 H110"/><path d="M82 141 Q86 153 100 153 Q114 153 118 141"/><path d="M78 145 L82 140 L87 144"/><path d="M122 145 L118 140 L113 144"/></g></g></svg>`;
}
const arrow = `<svg class="mr-route-arrow" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></g></svg>`;
const menuIcon = `<svg class="mr-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></g></svg>`;
const sticker = (cls = '') => `<span class="mr-sticker mr-roasty ${cls}" aria-hidden="true"><span><span class="mr-sticker-day" data-roast="day">الأحد</span><span class="mr-sticker-num" data-roast="num">٠</span></span></span>`;
const stickerNum = (cls = '') => `<span class="mr-sticker mr-roasty ${cls}" aria-hidden="true"><span class="mr-sticker-num" data-roast="num">٠</span></span>`;
const grinds = [['whole', 'حبّ'], ['turkish', 'تركي ناعم جدًا'], ['espresso', 'إسبريسو'], ['filter', 'فلتر وV60'], ['press', 'فرنش بريس']];
const chips = `<div class="mr-grind" role="radiogroup" aria-label="الطحنة"><p class="mr-grind-legend" aria-hidden="true">الطحنة</p><div class="mr-grind-opts">${grinds.map(([g, l]) => `<span class="mr-chip" role="radio" aria-checked="false" tabindex="-1" data-grind="${g}">${l}</span>`).join('')}</div></div>`;
const nav = [['/shop/', 'المتجر'], ['/brew/', 'إزاي تعمل قهوتك'], ['/roastery/', 'المحمصة'], ['/wholesale/', 'للكافيهات والمكاتب']];

const header = `<div class="mr-page mr-header-root">
<div class="mr-strip"><div class="mr-wrap mr-strip-in">${sticker()}<p class="mr-strip-text"><b>التحميصة الجاية: <span class="mr-nw" data-roast="date">الأحد أو الأربع</span></b> · اطلب لحد <span data-roast="cut">الليلة اللي قبلها</span> ١١ بالليل ويطلع لك <span class="mr-nw" data-roast="out">تاني يوم</span></p></div></div>
<div class="mr-head"><div class="mr-wrap mr-head-in">
<a class="mr-brand" href="/" aria-label="مرسى، الصفحة الرئيسية">${stamp('', '')}<span class="mr-brand-name">مرسى</span></a>
<nav class="mr-nav" aria-label="الأقسام">${nav.map(([h, t]) => `<a class="mr-nav-link" href="${h}">${t}</a>`).join('')}</nav>
<div class="mr-head-tools"><div bd-woo="search" class="mr-search"></div><div bd-woo="mini-cart" class="mr-minicart"></div>
<details class="mr-menu"><summary class="mr-menu-btn" aria-label="القايمة">${menuIcon}</summary><nav class="mr-menu-panel" aria-label="الأقسام">${nav.concat([['/my-account/', 'حسابي']]).map(([h, t]) => `<a class="mr-menu-link" href="${h}">${t}</a>`).join('')}</nav></details>
</div></div></div></div>`;

const coffeeCard = `<article class="mr-label mr-coffee mr-buyable">
<a class="mr-duo mr-coffee-media" bd-href="post_permalink"><img bd-src="product_image" bd-alt="product_title"></a>
<div class="mr-coffee-body"><h3 class="mr-coffee-title"><a bd-href="post_permalink" bd-bind="product_title"></a></h3>
<p class="mr-meta" bd-bind="post_custom_field" bd-params='{"key":"_marsa_origin"}'></p>
<p class="mr-meta" bd-bind="post_custom_field" bd-params='{"key":"_marsa_roast"}'></p>
<p class="mr-notes" bd-bind="post_custom_field" bd-params='{"key":"_marsa_notes"}'></p></div>
${chips}
<div class="mr-buy"><p class="mr-price" bd-bind="product_price"></p><div bd-woo="add-to-cart" class="mr-add"></div></div>
<span class="mr-data mr-data-grind" bd-bind="post_custom_field" bd-params='{"key":"_marsa_grind"}'></span>
<span class="mr-data mr-data-methods" bd-bind="post_custom_field" bd-params='{"key":"_marsa_methods"}'></span>
</article>`;

const toolCard = `<article class="mr-label mr-tool mr-buyable">
<a class="mr-duo" bd-href="post_permalink"><img bd-src="product_image" bd-alt="product_title"></a>
<div><h3 class="mr-tool-title"><a bd-href="post_permalink" bd-bind="product_title"></a></h3><p class="mr-meta" bd-bind="post_custom_field" bd-params='{"key":"_marsa_origin"}'></p></div>
<div class="mr-buy"><p class="mr-price" bd-bind="product_price"></p><div bd-woo="add-to-cart" class="mr-add"></div></div>
</article>`;

const bestCard = `<article class="mr-label mr-best mr-buyable">
<div class="mr-best-top"><h2 class="mr-best-title">المحوّج بتاعنا</h2><p class="mr-price" bd-bind="product_price"></p></div>
<p class="mr-best-meta">بن تركي محوّج · وسط لغامق · ٢٥٠ جم</p>
<p class="mr-best-desc">أكتر حاجة بتتطلب. بن تركي محمّص وسط لغامق، مطحون ناعم، وعليه حبهان مطحون معاه. اللي بيشربه الصبح مش بيغيّره.</p>
<p class="mr-roast-line">${stickerNum()}<span class="mr-roasty">لو طلبت النهارده: يتحمّص <span class="mr-nw" data-roast="short">الأحد</span> ويطلع <span class="mr-nw" data-roast="out">الإثنين</span></span></p>
${chips}
<div bd-woo="add-to-cart" class="mr-add"></div>
<span class="mr-data mr-data-grind" bd-bind="post_custom_field" bd-params='{"key":"_marsa_grind"}'></span>
</article>`;

const methods = [
  ['turk', 'turkish', 'تركي ناعم جدًا', 'method_turkish', 'كنكتين نحاس صغيرين بيغلوا في رمل سخن', 'كنكة', 'طحنة ناعمة جدًا', 'التلات أنواع البن التركي'],
  ['esp', 'espresso', 'إسبريسو', 'method_espresso', 'إسبريسو نازل من المكنة في فنجان أبيض', 'إسبريسو', 'طحنة ناعمة', 'المينا، البرازيلي، الكولومبي'],
  ['filter', 'filter', 'فلتر وV60', 'method_pourover', 'مية سخنة بتتصب على بن مطحون في قمع تقطير فوق إبريق إزاز', 'فلتر وV60', 'طحنة وسط', 'الإثيوبي، الكولومبي'],
  ['press', 'press', 'فرنش بريس', 'method_frenchpress', 'فرنش بريس مليان قهوة جنب فنجان أبيض على صينية خشب', 'فرنش بريس', 'طحنة خشنة', 'البرازيلي، الكولومبي'],
];

const home = `<div class="mr-page">
<section class="mr-hero" aria-labelledby="hero-title"><div class="mr-wrap"><div class="mr-hero-grid">
<div class="mr-hero-copy"><h1 id="hero-title" class="mr-hero-title"><span>بن طازة،</span><span>من المحمصة</span><span>لكنكتك</span></h1>${stamp('', '')}</div>
<div class="mr-hero-figure"><div class="mr-duo mr-hero-photo"><img src="${U}hero.png" width="1100" height="733" alt="بن لسه طالع من التحميص بيتقلّب في صينية التبريد" fetchpriority="high"></div>${stamp('', '')}
<div bd-loop="products" bd-featured="true" bd-limit="1" bd-loop-name="مرسى · الأكتر طلبًا" class="mr-best-row">${bestCard}</div></div>
<div class="mr-hero-more"><p class="mr-hero-lead">بنحمّص مرتين في الأسبوع، الأحد والأربع، وبنطحن على طلبك. كل كيس عليه تاريخ تحميصه.</p><div class="mr-hero-actions"><a class="mr-btn" href="/shop/">اختار بنّك</a><a class="mr-link" href="/brew/">إزاي تعمل قهوتك</a></div></div>
</div></div>
<div class="mr-route" aria-label="طلبك ماشي إزاي"><ol class="mr-route-list"><li class="mr-route-item">تطلب</li><li class="mr-route-item">${arrow}</li><li class="mr-route-item">نحمّص <span data-roast="short">الأحد أو الأربع</span> ${stickerNum()}</li><li class="mr-route-item">${arrow}</li><li class="mr-route-item">يطلع <span data-roast="out">تاني يوم</span></li></ol></div>
</section>

<section class="mr-sec" aria-labelledby="methods-title"><div class="mr-wrap">
<div class="mr-sec-head"><h2 id="methods-title" class="mr-sec-title">بتعمل قهوتك بإيه؟</h2><p class="mr-sec-note">اختار طريقتك ونوريك البن اللي ينفع معاها، وبنطحنه على قدها.</p></div>
<div class="mr-methods">${methods.map(([m, g, gl, img, alt, t, mark, goes]) => `<a class="mr-method" href="#coffees" data-m="${m}" data-grind="${g}" data-grind-label="${gl}"><div class="mr-duo"><img src="${U}${img}.png" alt="${alt}" loading="lazy"></div><h3 class="mr-method-title">${t}</h3><span class="mr-mark">${mark}</span><span class="mr-goes">${goes}</span></a>`).join('')}</div>
</div></section>

<section id="coffees" class="mr-sec mr-sec-flush" aria-labelledby="coffees-title"><div class="mr-wrap">
<div class="mr-sec-head"><h2 id="coffees-title" class="mr-sec-title">بن تركي وبن من بلاد بعيدة</h2><a class="mr-link" href="/shop/">كل البن</a></div>
<div class="mr-shelf-bar" aria-live="polite"><p class="mr-shelf-state">في المحمصة دلوقتي، مترتبين من الفاتح للغامق.</p><span class="mr-chip-reset" role="button" tabindex="0">رجّع كل البن</span></div>
<div bd-loop="products" bd-category="turkish,origins,espresso" bd-orderby="menu_order" bd-order="ASC" bd-limit="12" bd-loop-name="مرسى · كارت البن" class="mr-shelf">${coffeeCard}</div>
<div bd-loop="products" bd-category="tools" bd-orderby="menu_order" bd-order="ASC" bd-limit="4" bd-loop-name="مرسى · كارت الأدوات" class="mr-tools">${toolCard}</div>
<a class="mr-shelf-end" href="/shop/">كل البن في المتجر ${arrow}</a>
</div></section>

<section class="mr-sec mr-order" aria-labelledby="order-title"><div class="mr-wrap">
<div class="mr-sec-head"><h2 id="order-title" class="mr-sec-title">من التحميصة لباب بيتك</h2></div>
<ol class="mr-steps">
<li><h3 class="mr-step-title">تطلب</h3><p class="mr-when">لحد <span data-roast="cut">الليلة اللي قبل التحميص</span> ١١ بالليل</p><p class="mr-step-text">تختار البن والطحنة، وتدفع كاش عند الاستلام أو بالكارت.</p></li>
<li><h3 class="mr-step-title">نحمّص</h3><p class="mr-when">${sticker()}<span data-roast="date">الأحد أو الأربع</span></p><p class="mr-step-text">طلبك يدخل في التحميصة الجاية، الأحد أو الأربع، ونطحنه بعدها على طول.</p></li>
<li><h3 class="mr-step-title">يوصلك</h3><p class="mr-when">يطلع <span data-roast="out">تاني يوم</span></p><p class="mr-step-text">يطلع تاني يوم. في إسكندرية بيوصل نفس اليوم بـ٥٠ جنيه، وباقي المحافظات من ٢ لـ٤ أيام بـ٨٥ جنيه.</p></li>
</ol></div></section>

<section class="mr-sec" aria-labelledby="brew-title"><div class="mr-wrap mr-insert-wrap">
<div class="mr-label mr-insert"><h2 id="brew-title" class="mr-insert-title">فنجان تركي زي ما بنعمله في المحمصة</h2>
<ol class="mr-insert-steps"><li class="mr-insert-step">معلقة كبيرة بن لكل فنجان، ومية ساقعة.</li><li class="mr-insert-step">على نار هادية، وقلّب مرة واحدة بس في الأول.</li><li class="mr-insert-step">أول ما الوش يعلى، شيلها من على النار وصبّ على طول.</li></ol>
<a class="mr-link" href="/brew/">كل الطرق: كنكة، V60، إسبريسو، فرنش بريس</a></div>
${stamp('mr-brew-stamp', '')}
<div class="mr-duo mr-brew-photo"><img src="${U}bestseller.png" alt="كنكة نحاس وفنجان قهوة وكوباية مية على ترابيزة في بلكونة" loading="lazy"></div>
</div></section>

<section class="mr-sec mr-sec-flush" aria-labelledby="cafes-title"><div class="mr-wrap"><div class="mr-cafes">
<div class="mr-duo"><img src="${U}cafes.png" alt="شوال خيش مفتوح وبن محمّص مالي المكان حواليه" loading="lazy"></div>
<span class="mr-kilo" aria-hidden="true">بالكيلو</span>
<div class="mr-label mr-cafes-copy"><h2 id="cafes-title" class="mr-cafes-title">عندك كافيه أو مكتب؟</h2><p class="mr-cafes-text">بنبيع بالكيلو، وبنحمّص الخلطة على مزاجكم. ابعتلنا هتحتاجوا قد إيه في الأسبوع ونتكلم.</p><a class="mr-btn" href="/wholesale/">ابعت طلب</a></div>
</div></div></section>

<section class="mr-sec mr-sec-flush" aria-label="مساعدة"><div class="mr-wrap"><div class="mr-help">
<div class="mr-help-col mr-help-first"><h3 class="mr-help-title">محتار تختار؟</h3><p class="mr-help-text">ابعتلنا على واتساب بتعمل قهوتك بإيه وبتحبها إزاي، ونرشّحلك.</p><a class="mr-btn mr-whatsapp" href="#">اسألنا على واتساب</a></div>
<div class="mr-help-col"><h3 class="mr-help-title">الدفع</h3><p class="mr-help-text">كاش عند الاستلام أو بالكارت.</p></div>
<div class="mr-help-col"><h3 class="mr-help-title">لو هترجّع</h3><p class="mr-help-text">الكيس المقفول يترجع خلال ٧ أيام من الاستلام. البن المطحون مبيترجعش، إلا لو إحنا اللي طحناه غلط، ساعتها نبدّله.</p><a class="mr-link" href="/policies/">السياسات</a></div>
</div></div></section>
</div>`;

const footer = `<footer class="mr-page mr-foot"><div class="mr-wrap mr-foot-grid">${stamp('', 'ختم مرسى، محمصة بن، إسكندرية')}
<div><p class="mr-foot-line">محمصة بن صغيرة في إسكندرية. بنحمّص الأحد والأربع.</p>
<ul class="mr-foot-links">${nav.concat([['/policies/', 'السياسات'], ['/my-account/', 'حسابي'], ['/cart/', 'السلة']]).map(([h, t]) => `<li><a class="mr-foot-link" href="${h}">${t}</a></li>`).join('')}</ul></div>
</div></footer>`;

for (const [f, html] of Object.entries({ header, home, footer })) fs.writeFileSync(f + '.html', html.replace(/\n/g, ''));
console.log('ok', header.length, home.length, footer.length);
