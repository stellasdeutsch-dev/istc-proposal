/* ISTC concept redesign — shared nav / mobile menu / search / footer injection.
   Mirrors the real istc.int information architecture. Runs before i18n.js & main.js. */
(function(){
  // top-level -> which nav group is "active"
  var page = document.body.getAttribute('data-page') || '';
  var groupOf = { home:'', about:'who', governance:'who', documents:'who', members:'who',
    'what-we-do':'do', grants:'do', projects:'do',
    procurement:'proc', news:'media', expo:'expo', contact:'' };
  var activeGroup = groupOf[page] || '';

  var MENU = [
    { id:'who', key:'nav_who', href:'about.html', items:[
      { href:'about.html', k:'nav_who_about', d:'nav_who_about_d' },
      { href:'governance.html', k:'nav_who_gov', d:'nav_who_gov_d' },
      { href:'documents.html', k:'nav_who_docs', d:'nav_who_docs_d' } ] },
    { id:'do', key:'nav_do', href:'what-we-do.html', items:[
      { href:'grants.html', k:'nav_do_grants', d:'nav_do_grants_d' },
      { href:'grants.html#portal', k:'nav_do_portal', d:'nav_do_portal_d' },
      { href:'what-we-do.html#travel', k:'nav_do_travel', d:'nav_do_travel_d' },
      { href:'what-we-do.html#development', k:'nav_do_projdev', d:'nav_do_projdev_d' },
      { href:'projects.html', k:'nav_do_projects', d:'nav_do_projects_d' } ] },
    { id:'proc', key:'nav_proc', href:'procurement.html', items:[
      { href:'procurement.html', k:'nav_proc_tenders', d:'nav_proc_tenders_d' },
      { href:'procurement.html#support', k:'nav_proc_support', d:'nav_proc_support_d' } ] },
    { id:'media', key:'nav_media', href:'news.html', items:[
      { href:'news.html', k:'nav_media_news', d:'nav_media_news_d' },
      { href:'news.html#press', k:'nav_media_press', d:'nav_media_press_d' } ] },
    { id:'expo', key:'nav_expo', href:'expo.html', items:null }
  ];

  function megaFor(m){
    if(!m.items) return '<a href="'+m.href+'" class="nav-trigger" data-i18n="'+m.key+'">'+m.key+'</a>';
    var links = m.items.map(function(it){
      return '<a href="'+it.href+'" class="mega-link"><b data-i18n="'+it.k+'">'+it.k+'</b><span data-i18n="'+it.d+'">'+it.d+'</span></a>';
    }).join('');
    return '<a href="'+m.href+'" class="nav-trigger">'+
      '<span data-i18n="'+m.key+'">'+m.key+'</span> <span class="caret">▾</span></a>'+
      '<div class="mega"><div class="mega-inner">'+links+'</div></div>';
  }

  var navHTML =
    '<nav class="nav on-dark" id="nav"><div class="nav-inner">'+
      '<a href="index.html" class="brand"><img src="assets/istc-mark.png" class="brand-logo" alt="ISTC logo" /><span class="brand-txt">ISTC<small>Est. 1992</small></span></a>'+
      '<ul class="nav-menu">'+
        MENU.map(function(m){
          return '<li class="nav-item'+(m.items?' has-mega':'')+(m.id===activeGroup?' active':'')+'">'+megaFor(m)+'</li>';
        }).join('')+
      '</ul>'+
      '<div class="nav-actions">'+
        '<button class="icon-btn" id="searchBtn" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></button>'+
        '<div class="lang-switch" role="group" aria-label="Language"><button data-lang="en" class="active">EN</button><button data-lang="ru">RU</button><button data-lang="kk">ҚАЗ</button></div>'+
        '<a href="https://www.istc.int" target="_blank" rel="noopener" class="icon-btn" aria-label="Expert access"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></a>'+
        '<button class="hamb" id="hamb" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>'+
      '</div>'+
    '</div></nav>';

  // mobile accordion
  var mobHTML = '<div class="mobile-menu" id="mobileMenu">'+
    MENU.map(function(m){
      if(!m.items){
        return '<a class="mm-simple" href="'+m.href+'"><span data-i18n="'+m.key+'">'+m.key+'</span><span class="chev">→</span></a>';
      }
      var subs = m.items.map(function(it){ return '<a href="'+it.href+'" data-i18n="'+it.k+'">'+it.k+'</a>'; }).join('');
      return '<div class="mm-group"><button class="mm-head"><span data-i18n="'+m.key+'">'+m.key+'</span><span class="caret">▾</span></button><div class="mm-sub">'+subs+'</div></div>';
    }).join('')+
    '<a class="mm-simple mm-cta" href="https://www.istc.int" target="_blank" rel="noopener" style="color:var(--brand-2)"><span data-i18n="nav_join">Join Expert Database</span><span class="chev">↗</span></a>'+
  '</div>';

  // search overlay
  var searchLinks = [
    {h:'about.html',k:'nav_who_about'},{h:'governance.html',k:'nav_who_gov'},{h:'documents.html',k:'nav_who_docs'},
    {h:'grants.html',k:'nav_do_grants'},{h:'projects.html',k:'nav_do_projects'},{h:'what-we-do.html',k:'nav_do'},
    {h:'procurement.html',k:'nav_proc_tenders'},{h:'news.html',k:'nav_media_news'},{h:'expo.html',k:'nav_expo'},
    {h:'contact.html',k:'nav_contact'}
  ];
  var searchHTML = '<div class="search-overlay" id="searchOverlay">'+
    '<button class="search-close" id="searchClose" aria-label="Close">✕</button>'+
    '<div class="search-box">'+
      '<input type="text" id="searchInput" data-i18n-ph="search_ph" placeholder="Search ISTC…" aria-label="Search" autocomplete="off" />'+
      '<div class="search-hint" data-i18n="search_hint">Try “grants”, “tenders”, “governance”…</div>'+
      '<div class="search-results" id="searchResults">'+
        searchLinks.map(function(s){ return '<a href="'+s.h+'" data-i18n="'+s.k+'">'+s.k+'</a>'; }).join('')+
      '</div>'+
    '</div></div>';

  var footHTML =
  '<footer><div class="foot-grid">'+
    '<div class="foot-brand"><a href="index.html" class="brand"><img src="assets/istc-mark.png" class="brand-logo" alt="ISTC logo" /><span class="brand-txt">ISTC</span></a>'+
      '<p data-i18n="foot_tagline">International Science and Technology Center — an intergovernmental organization for peaceful scientific collaboration, headquartered in Astana, Kazakhstan.</p>'+
      '<div class="foot-social"><a href="https://www.linkedin.com/company/istc/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a><a href="https://www.facebook.com/istc.int/" target="_blank" rel="noopener" aria-label="Facebook">f</a><a href="https://www.youtube.com/@ISTC.1" target="_blank" rel="noopener" aria-label="YouTube">▶</a></div></div>'+
    '<div><h4 data-i18n="foot_explore">Explore</h4><ul>'+
      '<li><a href="about.html" data-i18n="nav_who_about">About ISTC</a></li>'+
      '<li><a href="what-we-do.html" data-i18n="nav_do">What We Do</a></li>'+
      '<li><a href="projects.html" data-i18n="nav_do_projects">Projects</a></li>'+
      '<li><a href="procurement.html" data-i18n="nav_proc">Procurement</a></li>'+
      '<li><a href="news.html" data-i18n="nav_media">Media center</a></li>'+
      '<li><a href="contact.html" data-i18n="nav_contact">Contact</a></li></ul></div>'+
    '<div><h4 data-i18n="foot_offices">Offices</h4><ul class="offices-foot">'+
      '<li><b data-i18n="foot_hq">Astana — HQ</b><span data-i18n="foot_hq_a">Syganaq Business Center, 70 Syganaq St.</span></li>'+
      '<li><b data-i18n="off_ye_c">Yerevan</b></li><li><b data-i18n="off_tb_c">Tbilisi</b></li>'+
      '<li><b data-i18n="off_bi_c">Bishkek</b></li><li><b data-i18n="off_du_c">Dushanbe</b></li></ul></div>'+
    '<div><h4 data-i18n="foot_contact_h">Contact</h4><ul>'+
      '<li><a href="mailto:istcinfo@istc.int">istcinfo@istc.int</a></li>'+
      '<li><a href="tel:+77172999395">+7 (7172) 999 395</a></li></ul></div>'+
  '</div>'+
  '<div class="foot-bottom"><span data-i18n="foot_rights">© 2026 International Science and Technology Center</span><span data-i18n="foot_cities">Astana · Yerevan · Tbilisi · Bishkek · Dushanbe</span></div>'+
  '<p class="disc" data-i18n="foot_disc">Concept redesign created by Shyngys Narseyit as a portfolio proposal. Not an official ISTC website; content is drawn from public ISTC sources for demonstration.</p></footer>';

  // inject
  var navRoot = document.getElementById('nav-root'); if(navRoot) navRoot.outerHTML = navHTML; else document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', mobHTML);
  document.body.insertAdjacentHTML('beforeend', searchHTML);
  var footRoot = document.getElementById('footer-root'); if(footRoot) footRoot.outerHTML = footHTML; else document.body.insertAdjacentHTML('beforeend', footHTML);
  if(!document.getElementById('totop')) document.body.insertAdjacentHTML('beforeend', '<button class="totop" id="totop" aria-label="Back to top">↑</button>');

  // mobile accordion
  document.querySelectorAll('.mm-head').forEach(function(h){
    h.addEventListener('click', function(){
      var g = h.parentElement, sub = g.querySelector('.mm-sub');
      var open = g.classList.toggle('open');
      sub.style.maxHeight = open ? sub.scrollHeight+'px' : '0';
    });
  });

  // search overlay
  var ov = document.getElementById('searchOverlay'), sBtn = document.getElementById('searchBtn'),
      sClose = document.getElementById('searchClose'), sInput = document.getElementById('searchInput');
  function openSearch(){ ov.classList.add('open'); setTimeout(function(){ sInput && sInput.focus(); }, 120); }
  function closeSearch(){ ov.classList.remove('open'); }
  if(sBtn) sBtn.addEventListener('click', openSearch);
  if(sClose) sClose.addEventListener('click', closeSearch);
  if(ov) ov.addEventListener('click', function(e){ if(e.target===ov) closeSearch(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeSearch(); });
  if(sInput) sInput.addEventListener('input', function(){
    var q = sInput.value.trim().toLowerCase();
    document.querySelectorAll('#searchResults a').forEach(function(a){
      a.classList.toggle('hide', q.length>0 && a.textContent.toLowerCase().indexOf(q)===-1);
    });
  });
})();
