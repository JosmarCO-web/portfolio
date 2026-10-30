/* Shared header, footer and helpers */
(function () {
  var S = window.SITE;
  var page = document.body.getAttribute('data-page');
  var NAV = [
    ['photography', 'Photography', 'photography.html'],
    ['videography', 'Videography', 'videography.html'],
    ['filmography', 'Filmography', 'filmography.html'],
    ['music', 'Sound & Music', 'music.html'],
    ['about', 'About', 'about.html'],
    ['contact', 'Contact', 'contact.html']
  ];

  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  window.ytThumb = function (id) { return 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg'; };
  window.ytThumbFallback = function (img, id) {
    img.onerror = null; img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  };
  window.isLocalFile = location.protocol === 'file:';
  window.fmtTime = function (s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  window.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  // Header
  var header = document.createElement('header');
  header.className = 'site-header' + (page === 'home' ? ' over-hero' : '');
  header.innerHTML =
    '<a class="brand" href="index.html">' + esc(S.name) + '</a>' +
    '<button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>' +
    '<nav class="nav" aria-label="Main">' +
    NAV.map(function (n) {
      return '<a href="' + n[2] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + esc(n[1]) + '</a>';
    }).join('') + '</nav>';
  document.body.insertBefore(header, document.body.firstChild);
  header.querySelector('.nav-toggle').addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', open);
  });

  // Footer (home has its own contact section instead)
  if (page !== 'home') {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML = '<span>© ' + new Date().getFullYear() + ' ' + esc(S.name) + '</span>' +
      '<span class="links"><a href="mailto:' + S.email + '">' + S.email + '</a>' +
      S.socials.map(function (s) { return '<a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>'; }).join('') +
      '</span>';
    (document.querySelector('main') || document.body).after(f);
  }
})();
