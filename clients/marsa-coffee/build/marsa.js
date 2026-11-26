(function () {
  var d = document, AR = '٠١٢٣٤٥٦٧٨٩';
  function ar(n) { return String(n).replace(/\d/g, function (c) { return AR[c]; }); }
  var DAYS = ['الأحد', 'الإثنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  /* The roast rule (content/HOME.md): roasts on Sunday and Wednesday; orders close at 11 pm the night before; the order goes out the day after the roast. Worked out in Cairo time. */
  function roast() {
    var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
    for (var i = 0; i < 8; i++) {
      var r = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (r.getDay() !== 0 && r.getDay() !== 3) continue;
      if (now < new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1, 23, 0, 0)) {
        var cut = new Date(r.getFullYear(), r.getMonth(), r.getDate() - 1);
        var out = new Date(r.getFullYear(), r.getMonth(), r.getDate() + 1);
        return {
          day: DAYS[r.getDay()], num: ar(r.getDate()),
          date: DAYS[r.getDay()] + ' ' + ar(r.getDate()) + ' ' + MONTHS[r.getMonth()],
          short: DAYS[r.getDay()] + ' ' + ar(r.getDate()),
          cut: DAYS[cut.getDay()],
          out: DAYS[out.getDay()] + ' ' + ar(out.getDate())
        };
      }
    }
  }
  var v = roast();
  if (v) {
    d.querySelectorAll('[data-roast]').forEach(function (e) { e.textContent = v[e.getAttribute('data-roast')]; });
    d.documentElement.classList.add('mr-roast-on');
  }

  /* Grind stamps and add to cart on product labels */
  var say = d.createElement('p'); say.className = 'mr-vh'; say.setAttribute('aria-live', 'polite'); d.body.appendChild(say);
  function stampCard(card, text) {
    var m = card.querySelector('.mr-cart-mark');
    if (!m) { m = d.createElement('div'); m.className = 'mr-cart-mark'; m.setAttribute('aria-hidden', 'true'); card.appendChild(m); }
    m.textContent = text;
  }
  function refreshCart() {
    if (window.jQuery) window.jQuery(d.body).trigger('wc_fragment_refresh');
  }
  d.querySelectorAll('.mr-buyable').forEach(function (card) {
    var chips = Array.prototype.slice.call(card.querySelectorAll('.mr-chip'));
    var btn = card.querySelector('.mr-add a.button');
    if (btn) btn.textContent = 'حطّه في السلة';
    if (chips.length) {
      var dg = card.querySelector('.mr-data-grind'), def = dg ? dg.textContent.trim() : '';
      var pick = function (ch) { chips.forEach(function (c) { c.setAttribute('aria-checked', c === ch ? 'true' : 'false'); c.tabIndex = c === ch ? 0 : -1; }); };
      pick(chips.filter(function (c) { return c.getAttribute('data-grind') === def; })[0] || chips[0]);
      chips.forEach(function (c, i) {
        c.addEventListener('click', function () { pick(c); });
        c.addEventListener('keydown', function (e) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pick(c); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            var n = chips[(i + (e.key === 'ArrowLeft' ? 1 : chips.length - 1)) % chips.length]; pick(n); n.focus();
          }
        });
      });
    }
    if (!btn) return;
    var id = btn.getAttribute('data-product_id');
    var name = (card.querySelector('.mr-coffee-title, .mr-best-title, .mr-tool-title') || {}).textContent || '';
    if (!chips.length) {
      /* simple products: WooCommerce's own AJAX add; stamp the label when it lands */
      if (window.jQuery) window.jQuery(d.body).on('added_to_cart', function (e, f, h, b) {
        if (b && b[0] === btn) { stampCard(card, 'في السلة'); say.textContent = 'اتحط في السلة: ' + name; }
      });
      return;
    }
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var ch = card.querySelector('.mr-chip[aria-checked="true"]'), g = ch.getAttribute('data-grind'), label = ch.textContent.trim();
      btn.setAttribute('aria-busy', 'true');
      /* WooCommerce Store API: it picks the variation from the grind */
      fetch('/wp-json/wc/store/v1/cart', { credentials: 'same-origin' })
        .then(function (r) {
          return fetch('/wp-json/wc/store/v1/cart/add-item', {
            method: 'POST', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Nonce': r.headers.get('Nonce') || '' },
            body: JSON.stringify({ id: +id, quantity: 1, variation: [{ attribute: 'pa_grind', value: g }] })
          });
        })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          stampCard(card, 'في السلة · ' + label);
          btn.textContent = 'حطّ كمان واحد';
          say.textContent = 'اتحط في السلة: ' + name + '، طحنة ' + label;
          refreshCart();
        })
        .catch(function () { window.location.href = btn.href; })
        .then(function () { btn.removeAttribute('aria-busy'); });
    }, true);
  });

  /* Product page: the grind select becomes the same stamps; the select stays the source of truth */
  var sel = d.querySelector('.mr-pdp-cta select[name="attribute_pa_grind"]');
  if (sel) {
    var table = sel.closest('table');
    var box = d.createElement('div'); box.className = 'mr-grind'; box.setAttribute('role', 'radiogroup'); box.setAttribute('aria-label', 'الطحنة');
    box.innerHTML = '<p class="mr-grind-legend" aria-hidden="true">الطحنة</p><div class="mr-grind-opts"></div>';
    var opts = box.lastChild, pchips = [];
    Array.prototype.forEach.call(sel.options, function (o) {
      if (!o.value) return;
      var c = d.createElement('span'); c.className = 'mr-chip'; c.setAttribute('role', 'radio'); c.textContent = o.textContent; c.setAttribute('data-grind', o.value);
      opts.appendChild(c); pchips.push(c);
    });
    var sync = function () { pchips.forEach(function (c) { var on = c.getAttribute('data-grind') === sel.value; c.setAttribute('aria-checked', on ? 'true' : 'false'); c.tabIndex = on ? 0 : -1; }); if (sel.value === '' && pchips[0]) pchips[0].tabIndex = 0; };
    pchips.forEach(function (c, i) {
      var choose = function () { sel.value = c.getAttribute('data-grind'); if (window.jQuery) window.jQuery(sel).trigger('change'); else sel.dispatchEvent(new Event('change', { bubbles: true })); sync(); };
      c.addEventListener('click', choose);
      c.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); choose(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); var n = pchips[(i + (e.key === 'ArrowLeft' ? 1 : pchips.length - 1)) % pchips.length]; n.click(); n.focus(); }
      });
    });
    table.parentNode.insertBefore(box, table);
    table.style.display = 'none';
    sel.addEventListener('change', sync);
    sync();
  }

  /* "How do you make it?" tiles filter the shelf and preset the grind */
  var methods = d.querySelectorAll('.mr-method'), cards = d.querySelectorAll('.mr-shelf .mr-coffee');
  var state = d.querySelector('.mr-shelf-state'), reset = d.querySelector('.mr-chip-reset');
  if (!methods.length || !state) return;
  var base = state.textContent;
  function clear() {
    methods.forEach(function (m) { m.setAttribute('aria-pressed', 'false'); });
    cards.forEach(function (c) { c.hidden = false; c.style.display = ''; });
    state.textContent = base; if (reset) reset.style.display = 'none';
  }
  methods.forEach(function (m) {
    m.setAttribute('role', 'button'); m.setAttribute('aria-pressed', 'false');
    m.addEventListener('click', function (e) {
      e.preventDefault();
      if (m.getAttribute('aria-pressed') === 'true') { clear(); return; }
      var key = m.getAttribute('data-m'), grind = m.getAttribute('data-grind'), n = 0;
      methods.forEach(function (x) { x.setAttribute('aria-pressed', x === m ? 'true' : 'false'); });
      cards.forEach(function (c) {
        var dm = c.querySelector('.mr-data-methods'), ok = dm && (' ' + dm.textContent.trim() + ' ').indexOf(' ' + key + ' ') > -1;
        c.style.display = ok ? '' : 'none';
        if (ok) { n++; var ch = c.querySelector('.mr-chip[data-grind="' + grind + '"]'); if (ch) ch.click(); }
      });
      var title = m.querySelector('.mr-method-title');
      state.textContent = 'بن ينفع لـ' + (title ? title.textContent.trim() : '') + ' (' + ar(n) + ')، والطحنة متظبطة على ' + m.getAttribute('data-grind-label') + '.';
      if (reset) reset.style.display = 'inline-flex';
      var shelf = d.getElementById('coffees'); if (shelf) shelf.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (reset) {
    reset.addEventListener('click', clear);
    reset.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clear(); } });
  }
})();
