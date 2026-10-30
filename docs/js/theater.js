/* Shared video hub: grid (dock-style or poster grid) → animated theater mode.
   Used by Videography and Filmography. */
window.createHub = function (el, o) {
  var items = o.items;
  var EASE = 'cubic-bezier(.22,.8,.24,1)', DUR = 650;
  el.classList.add('hub'); if (o.posters) el.classList.add('posters');
  el.setAttribute('data-mode', 'grid');
  el.innerHTML =
    '<div class="hub-stage"><div class="stage-head"><span class="label">Now playing</span>' +
    '<button class="back-btn">← ' + esc(o.backLabel || 'All videos') + '</button></div>' +
    '<div class="player"></div><div class="info"></div></div>' +
    '<div class="hub-list">' + items.map(function (it, i) {
      return '<button class="hub-tile" data-i="' + i + '" aria-label="Play ' + esc(it.title) + '"><div class="tile-inner">' +
        '<div class="thumb">' + (o.badge ? o.badge(it) : '') +
        '<img alt="" src="' + o.thumb(it) + '" loading="lazy"><span class="play"></span></div>' +
        '<div class="meta"><div class="t">' + esc(it.title) + '</div>' + (o.sub ? '<div class="s">' + esc(o.sub(it)) + '</div>' : '') + '</div>' +
        '</div></button>';
    }).join('') + '</div>';

  var list = el.querySelector('.hub-list');
  var tiles = [].slice.call(list.children);
  var player = el.querySelector('.player');
  var info = el.querySelector('.info');
  var active = -1, busy = false;

  tiles.forEach(function (t, i) {
    var img = t.querySelector('img');
    img.onerror = function () { if (o.thumbFallback) o.thumbFallback(img, items[i]); };
  });

  /* ---- FLIP helper: animate tiles from old positions to new ---- */
  function flip(mutate, overrides) {
    var first = tiles.map(function (t) { return t.getBoundingClientRect(); });
    mutate();
    tiles.forEach(function (t, i) {
      var b = t.getBoundingClientRect();
      if (!b.width) return;
      var a = (overrides && overrides[i]) || first[i];
      if (!a.width) { t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease' }); return; }
      var s = a.width / b.width;
      t.animate([
        { transformOrigin: 'top left', transform: 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + s + ')' },
        { transformOrigin: 'top left', transform: 'none' }
      ], { duration: DUR, easing: EASE });
    });
  }
  function ghost(src, from, to, done) {
    var g = document.createElement('div');
    g.className = 'ghost';
    g.innerHTML = '<img alt="">';
    var gi = g.querySelector('img');
    gi.src = src;
    document.body.appendChild(g);
    var kf = function (r) { return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }; };
    var anim = g.animate([kf(from), kf(to)], { duration: DUR, easing: EASE, fill: 'forwards' });
    anim.onfinish = function () { done(); requestAnimationFrame(function () { g.remove(); }); };
  }
  function setPlayerPoster(it) {
    player.innerHTML = '<img alt="" src="' + ytThumb(it.yt) + '">';
    var pi = player.querySelector('img');
    pi.onerror = function () { ytThumbFallback(pi, it.yt); };
  }
  function startVideo(it) {
    if (window.isLocalFile) {
      player.insertAdjacentHTML('beforeend',
        '<div class="local-note"><div>Video playback turns on once the site is online.</div>' +
        '<a href="https://youtu.be/' + it.yt + '" target="_blank" rel="noopener">Watch on YouTube ↗</a></div>');
      return;
    }
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + it.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title = it.title;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    player.appendChild(f);
  }
  function setInfo(it) { info.innerHTML = o.info(it); }

  function open(i) {
    if (busy || i === active) return;
    busy = true;
    var it = items[i];
    var src = tiles[i].querySelector('img').src;
    var from = tiles[i].querySelector('.thumb').getBoundingClientRect();
    var wasGrid = active < 0;
    resetDock();
    if (wasGrid) {
      flip(function () {
        el.setAttribute('data-mode', 'theater');
        tiles.forEach(function (t, k) { t.classList.toggle('active', k === i); });
        setPlayerPoster(it); setInfo(it);
        var top = el.getBoundingClientRect().top + window.scrollY - 24;
        if (window.scrollY > top || el.getBoundingClientRect().top > window.innerHeight * 0.4) window.scrollTo(0, top);
      });
    } else {
      info.classList.add('fade');
      flip(function () {
        tiles.forEach(function (t, k) { t.classList.toggle('active', k === i); });
        setPlayerPoster(it);
      });
      setTimeout(function () { setInfo(it); info.classList.remove('fade'); }, 300);
    }
    active = i;
    player.style.visibility = 'hidden';
    ghost(src, from, player.getBoundingClientRect(), function () {
      player.style.visibility = '';
      startVideo(it);
      busy = false;
    });
  }
  function close() {
    if (busy || active < 0) return;
    var pr = player.getBoundingClientRect(), ov = {};
    ov[active] = pr;
    player.innerHTML = '';
    flip(function () {
      el.setAttribute('data-mode', 'grid');
      tiles.forEach(function (t) { t.classList.remove('active'); });
    }, ov);
    active = -1;
  }
  list.addEventListener('click', function (e) {
    var t = e.target.closest('.hub-tile'); if (t) open(+t.dataset.i);
  });
  el.querySelector('.back-btn').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* ---- Dock-style magnification (grid mode only) ---- */
  var base = 240;
  function sizeBase() {
    if (!o.dock) return;
    var w = list.clientWidth, n = tiles.length, gap = 18;
    base = Math.max(140, Math.min(250, (w - gap * (n - 1)) / n / 1.18));
    resetDock();
  }
  function resetDock() { tiles.forEach(function (t) { t.querySelector('.tile-inner').style.setProperty('--w', base + 'px'); }); }
  if (o.dock) {
    list.style.flexWrap = 'nowrap';
    sizeBase();
    window.addEventListener('resize', sizeBase);
    list.addEventListener('mousemove', function (e) {
      if (active >= 0 || window.innerWidth <= 820) return;
      tiles.forEach(function (t) {
        var r = t.getBoundingClientRect();
        var d = Math.abs(e.clientX - (r.left + r.width / 2));
        var f = Math.max(0, 1 - d / 320);
        t.querySelector('.tile-inner').style.setProperty('--w', (base * (1 + 0.42 * f * f)) + 'px');
      });
    });
    list.addEventListener('mouseleave', resetDock);
  }
};
