(function () {
  var cats = window.SITE.photos;
  var tabs = document.getElementById('tabs');
  var grid = document.getElementById('grid');
  var current = 0;

  tabs.innerHTML = cats.map(function (c, i) {
    return '<button class="tab" role="tab" data-i="' + i + '">' + esc(c.label) + '<span class="count">' + c.photos.length + '</span></button>';
  }).join('');
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('.tab'); if (b) selectCat(+b.dataset.i, true);
  });

  function selectCat(i, push) {
    current = i;
    [].forEach.call(tabs.children, function (t, k) { t.setAttribute('aria-selected', k === i); });
    grid.innerHTML = cats[i].photos.map(function (p, k) {
      return '<button class="ph" data-k="' + k + '" style="animation-delay:' + (k * 45) + 'ms">' +
        '<img src="' + p.thumb + '" width="' + p.w + '" height="' + p.h + '" alt="' + esc(p.title) + '" loading="lazy">' +
        '<span class="ph-cap">' + esc(p.title) + '</span></button>';
    }).join('');
    if (push) history.replaceState(null, '', '#' + cats[i].id);
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.ph'); if (b) openLB(current, +b.dataset.k);
  });

  var start = 0;
  var h = location.hash.slice(1);
  cats.forEach(function (c, i) { if (c.id === h) start = i; });
  selectCat(start, false);

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lb'), img = document.getElementById('lb-img');
  var capEl = document.getElementById('lb-caption'), countEl = document.getElementById('lb-count');
  var catEl = document.getElementById('lb-cat'), splash = document.getElementById('lb-splash');
  var splashName = document.getElementById('lb-splash-name');
  var lc = 0, lk = 0, busy = false;

  function render() {
    var c = cats[lc], p = c.photos[lk];
    catEl.textContent = c.label;
    countEl.textContent = (lk + 1) + ' / ' + c.photos.length;
    capEl.innerHTML = esc(p.title) + (p.date ? '<span class="date">' + esc(p.date) + '</span>' : '');
  }
  function load(src, cb) {
    var pre = new Image(); pre.onload = pre.onerror = cb; pre.src = src;
  }
  function openLB(c, k) {
    lc = c; lk = k;
    img.src = cats[c].photos[k].full; img.alt = cats[c].photos[k].title;
    render();
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeLB() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  function go(dir) {
    if (busy) return;
    var c = lc, k = lk + dir, albumChange = false;
    if (k >= cats[c].photos.length) { c = (c + 1) % cats.length; k = 0; albumChange = true; }
    else if (k < 0) { c = (c - 1 + cats.length) % cats.length; k = cats[c].photos.length - 1; albumChange = true; }
    var p = cats[c].photos[k];
    busy = true;
    img.classList.add('out');
    if (!albumChange) {
      load(p.full, function () {
        setTimeout(function () {
          lc = c; lk = k; img.src = p.full; img.alt = p.title; render();
          img.classList.remove('out'); busy = false;
        }, 180);
      });
    } else {
      // fade out → album name splash → fade in first photo of the new album
      splashName.textContent = cats[c].label;
      splash.querySelector('.label').textContent = dir > 0 ? 'Next album' : 'Previous album';
      capEl.style.opacity = 0;
      setTimeout(function () { splash.classList.add('show'); }, 300);
      load(p.full, function () {
        setTimeout(function () {
          splash.classList.remove('show');
          lc = c; lk = k; img.src = p.full; img.alt = p.title; render();
          if (lc !== current) selectCat(lc, true);
          setTimeout(function () { img.classList.remove('out'); capEl.style.opacity = 1; busy = false; }, 350);
        }, 1300);
      });
    }
  }
  document.getElementById('lb-next').onclick = function () { go(1); };
  document.getElementById('lb-prev').onclick = function () { go(-1); };
  document.getElementById('lb-close').onclick = closeLB;
  lb.addEventListener('click', function (e) { if (e.target.classList.contains('lb-stage')) closeLB(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
})();
