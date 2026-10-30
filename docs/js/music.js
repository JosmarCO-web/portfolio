(function () {
  var S = window.SITE, tracks = S.tracks;
  var list = document.getElementById('tracks');
  var audio = document.getElementById('audio');
  var cur = 0;

  function credit(t) {
    if (t.owned) return (t.credit ? esc(t.credit) : '');
    return (t.credit ? 'Original track by ' + esc(t.credit) : 'Original artist unknown') + ' — mixed by me, not owned.';
  }
  function plainCredit(t) {
    return t.owned ? (t.credit || '') : (t.credit ? 'Original track by ' + t.credit : 'Original artist unknown');
  }
  list.innerHTML = tracks.map(function (t, i) {
    return '<li class="track" data-i="' + i + '" tabindex="0">' +
      '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<img class="art" src="' + S.cover + '" alt="">' +
      '<div><div class="title">' + esc(t.title) + (t.owned ? '<span class="pill own">Original</span>' : '<span class="pill">Not owned</span>') + '</div>' +
      '<div class="work">' + esc(t.work) + '</div>' +
      '<div class="credit">' + credit(t) + '</div></div>' +
      '<span class="dur">' + fmtTime(t.duration) + '</span></li>';
  }).join('');

  var rows = [].slice.call(list.children);
  var $ = function (id) { return document.getElementById(id); };
  var icon = $('pb-icon');
  var PLAY = 'M4 2l10 6-10 6z', PAUSE = 'M3 2h4v12H3zM9 2h4v12H9z';

  function load(i, play) {
    cur = (i + tracks.length) % tracks.length;
    var t = tracks[cur];
    audio.src = t.src;
    $('pb-title').textContent = t.title;
    $('pb-credit').textContent = t.work + ' · ' + plainCredit(t);
    $('pb-dur').textContent = fmtTime(t.duration);
    $('pb-fill').style.width = '0';
    rows.forEach(function (r, k) {
      r.classList.toggle('playing', k === cur);
      var n = r.querySelector('.n');
      n.innerHTML = k === cur ? '<span class="eq"><i></i><i></i><i></i></span>' : String(k + 1).padStart(2, '0');
    });
    if (play) audio.play().catch(function () {});
    sync();
  }
  function sync() {
    var playing = !audio.paused;
    icon.innerHTML = '<path d="' + (playing ? PAUSE : PLAY) + '"/>';
    $('pb-play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
    list.classList.toggle('paused', !playing);
  }
  function toggle() { if (audio.paused) audio.play().catch(function () {}); else audio.pause(); }

  list.addEventListener('click', function (e) {
    var r = e.target.closest('.track'); if (!r) return;
    var i = +r.dataset.i;
    if (i === cur && audio.src) toggle(); else load(i, true);
  });
  list.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click(); }
  });
  $('pb-play').onclick = toggle;
  $('pb-next').onclick = function () { load(cur + 1, true); };
  $('pb-prev').onclick = function () { if (audio.currentTime > 3) audio.currentTime = 0; else load(cur - 1, true); };
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  audio.addEventListener('ended', function () { load(cur + 1, true); });
  audio.addEventListener('timeupdate', function () {
    var d = audio.duration || tracks[cur].duration;
    $('pb-cur').textContent = fmtTime(audio.currentTime);
    $('pb-fill').style.width = (audio.currentTime / d * 100) + '%';
  });
  $('pb-progress').addEventListener('click', function (e) {
    var r = this.getBoundingClientRect();
    var d = audio.duration || tracks[cur].duration;
    audio.currentTime = (e.clientX - r.left) / r.width * d;
  });
  $('pb-art').src = S.cover;

  // reserve room for the fixed player bar
  function pad() { document.body.style.setProperty('--player-h', $('pbar').offsetHeight + 'px'); }
  window.addEventListener('resize', pad); pad();
  load(0, false);
})();
