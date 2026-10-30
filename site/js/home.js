(function () {
  var S = window.SITE;
  document.getElementById('hero-name').textContent = S.name;

  // All photos, randomized, crossfading
  var all = [];
  S.photos.forEach(function (c) { c.photos.forEach(function (p) { all.push(p); }); });
  var order = shuffle(all);
  var hero = document.getElementById('hero');
  var cap = document.getElementById('hero-caption');
  var layers = [0, 1].map(function () {
    var img = document.createElement('img');
    img.className = 'hero-slide'; img.alt = '';
    hero.insertBefore(img, hero.firstChild);
    return img;
  });
  var i = 0, front = 0;
  function show(p) {
    var next = layers[1 - front];
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      next.src = p.full; next.alt = p.title;
      next.classList.remove('on'); void next.offsetWidth; next.classList.add('on');
      layers[front].classList.remove('on');
      front = 1 - front;
      cap.classList.add('fade');
      setTimeout(function () { cap.textContent = p.title; cap.classList.remove('fade'); }, 450);
    };
    pre.src = p.full;
  }
  show(order[0]);
  setInterval(function () {
    i = (i + 1) % order.length;
    if (i === 0) order = shuffle(all);
    show(order[i]);
  }, 4000);

  // Tiles
  document.getElementById('tile-photo').src = order[1 % order.length].thumb;
  var v = S.videos[S.videos.length - 1];
  var tv = document.getElementById('tile-video');
  tv.onerror = function () { ytThumbFallback(tv, v.yt); };
  tv.src = ytThumb(v.yt);
  document.getElementById('tile-film').src = S.films[0].poster;
  document.getElementById('tile-music').src = S.cover;

  // Contact
  var e = document.getElementById('home-email');
  e.href = 'mailto:' + S.email; e.textContent = S.email;
  document.getElementById('home-socials').innerHTML = S.socials.map(function (s) {
    return '<a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>';
  }).join('');
  document.getElementById('home-fine').textContent = '© ' + new Date().getFullYear() + ' ' + S.name;
})();
