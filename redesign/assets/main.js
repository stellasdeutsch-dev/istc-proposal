/* ISTC concept redesign — shared behavior */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.getElementById('nav');
  var darktop = document.querySelector('.hero, .page-header');

  /* nav scrolled + on-dark */
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    if(darktop){
      var b = darktop.getBoundingClientRect().bottom;
      if(b > 64) nav.classList.add('on-dark'); else nav.classList.remove('on-dark');
    }
    var tt = document.getElementById('totop');
    if(tt){ if(window.scrollY > 600) tt.classList.add('show'); else tt.classList.remove('show'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu */
  var hamb = document.getElementById('hamb');
  if(hamb){
    hamb.addEventListener('click', function(){
      document.body.classList.toggle('menu-open');
      var open = document.body.classList.contains('menu-open');
      hamb.setAttribute('aria-expanded', open ? 'true':'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(a){
      a.addEventListener('click', function(){
        document.body.classList.remove('menu-open');
        document.body.style.overflow='';
        hamb.setAttribute('aria-expanded','false');
      });
    });
  }

  /* reveal on scroll */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* count-up */
  function easeOut(t){ return 1 - Math.pow(1-t,3); }
  function fmt(n){ return (window.istcFmt ? window.istcFmt(n) : n.toLocaleString('en-US')); }
  function countUp(el){
    var target = +el.getAttribute('data-count'), suffix = el.getAttribute('data-suffix')||'', dur=1500, start=null;
    if(reduce){ el.textContent = fmt(target)+suffix; el.dataset.done="1"; return; }
    function step(ts){ if(!start)start=ts; var p=Math.min((ts-start)/dur,1);
      el.textContent = fmt(Math.round(target*easeOut(p)))+suffix;
      if(p<1) requestAnimationFrame(step); else el.dataset.done="1"; }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  }, {threshold:0.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* back to top */
  var tt = document.getElementById('totop');
  if(tt){ tt.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduce?'auto':'smooth'}); }); }

  /* project filters */
  var filters = document.querySelector('.filters');
  if(filters){
    filters.addEventListener('click', function(e){
      var btn = e.target.closest('button'); if(!btn) return;
      filters.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      document.querySelectorAll('.proj[data-cat]').forEach(function(p){
        var show = (cat==='all' || p.getAttribute('data-cat').indexOf(cat)>-1);
        p.classList.toggle('hide', !show);
      });
    });
  }

  /* simulated form submit */
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var note = f.querySelector('[data-note]');
      if(note){ note.hidden=false; }
      f.querySelectorAll('input,textarea,select,button').forEach(function(el){ if(el.type!=='button') el.disabled=true; });
    });
  });

  /* ----- HERO PARTICLE NETWORK (home) ----- */
  var canvas = document.getElementById('net');
  if(canvas && canvas.getContext){
    var host = canvas.parentElement;
    var ctx = canvas.getContext('2d');
    var W=0,H=0, dpr=Math.min(window.devicePixelRatio||1,2), pts=[], raf=null, running=false, LINK=140;
    function resize(){
      W=host.clientWidth; H=host.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+'px'; canvas.style.height=H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      var count=Math.max(26, Math.min(76, Math.round(W*H/17000)));
      pts=[];
      for(var i=0;i<count;i++){ pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*0.28,vy:(Math.random()-.5)*0.28,r:Math.random()*1.6+0.8}); }
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        for(var j=i+1;j<pts.length;j++){
          var q=pts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
          if(d<LINK){ ctx.strokeStyle='rgba(90,160,255,'+(1-d/LINK)*0.5+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
        }
      }
      for(var k=0;k<pts.length;k++){ var pt=pts[k]; ctx.beginPath(); ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2); ctx.fillStyle='rgba(150,195,255,.9)'; ctx.fill(); }
    }
    function tick(){
      for(var i=0;i<pts.length;i++){ var p=pts[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; }
      draw(); raf=requestAnimationFrame(tick);
    }
    function start(){ if(running)return; running=true; raf=requestAnimationFrame(tick); }
    function stop(){ running=false; if(raf)cancelAnimationFrame(raf); }
    resize();
    if(reduce){ draw(); }
    else{
      start();
      var hio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting)start(); else stop(); }); },{threshold:0});
      hio.observe(host);
      var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(function(){ resize(); draw(); }, 180); });
    }
  }
})();
