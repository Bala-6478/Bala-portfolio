document.documentElement.classList.add('is-loading');


    /* Apply saved theme BEFORE first paint (prevents dark->light flash) */
    (function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light-theme');}}catch(e){}})();
  

(function(){emailjs.init({publicKey:"YOUR_PUBLIC_KEY"});})();


document.addEventListener('DOMContentLoaded',()=>{
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  AOS.init({duration:750,once:true,offset:70,easing:'ease-out-cubic',disable:()=>reduceMotion});

  /* ===== PRELOADER ===== */
  (function(){
    const pre=document.getElementById('preloader');
    const fill=document.getElementById('plBarFill');
    const status=document.getElementById('plStatus');
    if(!pre) return;
    const messages=['Loading Portfolio...','Preparing Projects...','Almost Ready...'];
    let pct=0,mi=0;
    status.textContent=messages[0];
    const iv=setInterval(()=>{
      pct+=Math.random()*18+6;
      if(pct>=96){pct=96;clearInterval(iv);}
      fill.style.width=pct+'%';
      const stage=Math.min(messages.length-1,Math.floor(pct/34));
      if(stage!==mi){mi=stage;status.textContent=messages[mi];}
    },220);
    function finish(){
      clearInterval(iv);
      fill.style.width='100%';
      status.textContent='Welcome';
      setTimeout(()=>{
        pre.classList.add('pl-hide');
        document.documentElement.classList.remove('is-loading');
        setTimeout(()=>{ if(pre.parentNode) pre.parentNode.removeChild(pre); },700);
      },350);
    }
    if(document.readyState==='complete'){ setTimeout(finish,600); }
    else{ window.addEventListener('load',()=>setTimeout(finish,400)); }
    setTimeout(finish,4000);
  })();

  /* ===== THEME — Dark <-> Light (saved, flash-free, synced across tabs) ===== */
  const root=document.documentElement;
  const themeBtn=document.getElementById('themeBtn');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const THEME_COLORS={dark:'#0b0d12',light:'#f0f2f5'};
  const themeIcons={dark:'fa-moon',light:'fa-sun'};
  let themeTimer;
  function applyTheme(t,animate){
    if(animate&&!reduceMotion){
      root.classList.add('theme-switching');
      clearTimeout(themeTimer);
      themeTimer=setTimeout(()=>root.classList.remove('theme-switching'),450);
    }
    root.classList.toggle('light-theme',t==='light');
    document.body.classList.remove('light-theme'); /* legacy cleanup */
    themeBtn.innerHTML=`<i class="fa-solid ${themeIcons[t]}"></i>`;
    themeBtn.setAttribute('aria-label',t==='light'?'Switch to dark theme':'Switch to light theme');
    themeBtn.title=t==='light'?'Switch to dark theme':'Switch to light theme';
    if(themeMeta) themeMeta.setAttribute('content',THEME_COLORS[t]);
  }
  let currentTheme=root.classList.contains('light-theme')?'light':'dark';
  applyTheme(currentTheme,false);
  themeBtn.addEventListener('click',()=>{
    currentTheme=currentTheme==='dark'?'light':'dark';
    applyTheme(currentTheme,true);
    try{localStorage.setItem('theme',currentTheme);}catch(e){}
  });
  window.addEventListener('storage',e=>{
    if(e.key==='theme'&&(e.newValue==='light'||e.newValue==='dark')&&e.newValue!==currentTheme){
      currentTheme=e.newValue;applyTheme(currentTheme,true);
    }
  });

  /* Hamburger */
  const hamburger=document.getElementById('hamburger');
  const mobileMenu=document.getElementById('mobileMenu');
  if(hamburger){
    hamburger.addEventListener('click',()=>{
      const a=mobileMenu.classList.toggle('active');
      hamburger.querySelector('i').className=a?'fa-solid fa-xmark':'fa-solid fa-bars';
    });
    mobileMenu.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{
      mobileMenu.classList.remove('active');
      hamburger.querySelector('i').className='fa-solid fa-bars';
    }));
  }

  /* ===== SMOOTH SCROLL WITH HEADER OFFSET (fixes hidden section titles on click) ===== */
  const headerEl=document.querySelector('header');
  function scrollToHash(hash,smooth){
    if(!hash||hash==='#'){return false;}
    const target=document.querySelector(hash);
    if(!target){return false;}
    /* make sure the mobile menu is closed so header height is correct */
    if(mobileMenu&&mobileMenu.classList.contains('active')){
      mobileMenu.classList.remove('active');
      const ic=hamburger&&hamburger.querySelector('i');
      if(ic) ic.className='fa-solid fa-bars';
    }
    const headerH=headerEl?headerEl.getBoundingClientRect().height:70;
    let y;
    if(hash==='#home'){
      y=0;
    } else {
      const anchor=target.querySelector('.section-title')||target;
      y=anchor.getBoundingClientRect().top+window.pageYOffset-headerH-24;
    }
    window.scrollTo({top:Math.max(0,y),behavior:smooth?'smooth':'auto'});
    return true;
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const hash=a.getAttribute('href');
      if(scrollToHash(hash,true)){
        e.preventDefault();
        if(history.replaceState) history.replaceState(null,'',hash);
      }
    });
  });
  /* If the page is opened with a #hash (e.g. #projects), land on it correctly */
  window.addEventListener('load',()=>{
    if(location.hash){ setTimeout(()=>scrollToHash(location.hash,false),700); }
  });

  /* ===== TYPEWRITER ===== */
  const tw=document.getElementById('typewriter');
  const words=['Frontend Developer','Web Developer','UI/UX Enthusiast'];
  let wi=0,ci=0,del=false,paused=false;
  function type(){
    const w=words[wi];
    let sp;
    if(paused){paused=false;del=true;sp=2400;setTimeout(type,sp);return;}
    if(del){
      tw.textContent=w.substring(0,ci-1);ci--;
      sp=40+Math.random()*30;
    } else {
      tw.textContent=w.substring(0,ci+1);ci++;
      sp=90+Math.random()*60;
    }
    if(!del&&ci===w.length){paused=true;sp=100;}
    else if(del&&ci===0){del=false;wi=(wi+1)%words.length;sp=420;}
    setTimeout(type,sp);
  }
  type();

  /* ===== SCROLL ENGINE — progress bar, header glass, active nav, back-to-top, parallax (rAF throttled) ===== */
  const sections=Array.from(document.querySelectorAll('main section[id]'));
  const allNavLinks=document.querySelectorAll('nav a, .mobile-menu a');
  const progressEl=document.getElementById('scrollProgress');
  const toTop=document.getElementById('toTop');
  const heroEl=document.querySelector('.hero');
  let ticking=false,lastActive='';
  function onScroll(){
    const y=window.pageYOffset||document.documentElement.scrollTop||0;
    const docH=document.documentElement.scrollHeight-window.innerHeight;
    const p=docH>0?Math.min(1,Math.max(0,y/docH)):0;
    progressEl.style.transform='scaleX('+p+')';
    headerEl.classList.toggle('scrolled',y>40);
    toTop.classList.toggle('show',y>600);
    if(heroEl&&!reduceMotion&&y<window.innerHeight*1.3){heroEl.style.setProperty('--py',(y*0.22)+'px');}

    const probe=window.innerHeight*0.35;
    let current=sections.length?sections[0].id:'';
    sections.forEach(s=>{if(s.getBoundingClientRect().top<=probe)current=s.id;});
    if(docH>0&&docH-y<4&&sections.length)current=sections[sections.length-1].id;
    if(current!==lastActive){
      lastActive=current;
      allNavLinks.forEach(l=>l.classList.toggle('active',(l.getAttribute('href')||'')==='#'+current));
    }
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
  window.addEventListener('resize',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}});
  onScroll();
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));

  /* Animated number counters */
  const cObs=new IntersectionObserver((entries,o)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const el=en.target,target=parseFloat(el.dataset.count),suffix=el.dataset.suffix||'';
      o.unobserve(el);
      if(reduceMotion){el.textContent=target+suffix;return;}
      const dur=1400,t0=performance.now();
      (function step(now){
        const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);
        el.textContent=Math.round(target*e)+suffix;
        if(k<1)requestAnimationFrame(step);
      })(t0);
    });
  },{threshold:0.6});
  document.querySelectorAll('[data-count]').forEach(el=>{el.textContent='0'+(el.dataset.suffix||'');cObs.observe(el);});

  /* Skill bars */
  const skillObs=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el=entry.target;
        el.classList.add('is-visible');
        const pct=el.querySelector('.skill-percentage');
        let cur=0,target=parseInt(el.dataset.level);
        const iv=setInterval(()=>{
          cur+=target/50;
          if(cur>=target){clearInterval(iv);pct.textContent=target+'%';}
          else pct.textContent=Math.ceil(cur)+'%';
        },30);
        observer.unobserve(el);
      }
    });
  },{threshold:0.4});
  document.querySelectorAll('.skill-card').forEach(s=>skillObs.observe(s));

  /* Section title underline */
  const titleObs2=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.5});
  document.querySelectorAll('.section-title').forEach(t=>titleObs2.observe(t));

  /* Stat box number pop on hover */
  document.querySelectorAll('.stat-box').forEach(box=>{
    box.addEventListener('mouseenter',()=>{
      const num=box.querySelector('.number');
      num.style.animation='none';
      void num.offsetWidth;
      num.style.animation='stat-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });

  /* Social icons pop */
  document.querySelectorAll('.socials a,.contact-socials a').forEach(a=>{
    a.addEventListener('mouseenter',()=>{
      a.style.animation='none';
      void a.offsetWidth;
      a.style.animation='social-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both';
    });
    a.addEventListener('mouseleave',()=>{ a.style.animation=''; });
  });

  /* Project filters */
  const filterBtns=document.querySelectorAll('.filter-btn');
  const projectCards=document.querySelectorAll('.project-card');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      btn.style.animation='none';
      void btn.offsetWidth;
      btn.style.animation='filter-bounce 0.35s cubic-bezier(0.34,1.56,0.64,1) both';
      const target=btn.dataset.target;
      let shown=0;
      projectCards.forEach(card=>{
        const hide=target!=='all'&&card.dataset.category!==target;
        card.classList.toggle('hidden',hide);
        card.classList.remove('card-enter');
        card.style.animationDelay='';
        if(!hide&&!reduceMotion){
          void card.offsetWidth;
          card.style.animationDelay=(shown*70)+'ms';
          card.classList.add('card-enter');
          const done=function(ev){
            if(ev.animationName!=='card-enter')return;
            card.classList.remove('card-enter');card.style.animationDelay='';
            card.removeEventListener('animationend',done);
          };
          card.addEventListener('animationend',done);
        }
        if(!hide)shown++;
      });
      AOS.refresh();
    });
  });

  /* Contact form */
  document.getElementById('contact-form').addEventListener('submit',function(e){
    e.preventDefault();
    const name=document.getElementById('from_name').value;
    const email=document.getElementById('email_id').value;
    const message=document.getElementById('message').value;
    const url=`https://wa.me/919952876478?text=Hello! I'm ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0AMessage:%0A${encodeURIComponent(message)}`;
    emailjs.sendForm('service_dtquy6q','template_YOUR_TEMPLATE_ID',this)
      .then(()=>{alert('Message sent! Opening WhatsApp...');this.reset();window.open(url,'_blank');},
            ()=>{alert('Opening WhatsApp to send your message...');window.open(url,'_blank');});
  });

  /* ===== MOBILE ENHANCEMENTS ===== */
  if(window.innerWidth<=780){
    const rippleTargets=document.querySelectorAll(
      '.education-card,.certificate-card,.skill-card,.project-card,.stat-box,.contact-card,.pub-card'
    );
    rippleTargets.forEach(function(el){
      el.addEventListener('touchstart',function(e){
        const touch=e.touches[0];
        const rect=el.getBoundingClientRect();
        const ripple=document.createElement('span');
        const size=Math.max(rect.width,rect.height)*1.4;
        ripple.style.cssText=`
          position:absolute;
          left:${touch.clientX-rect.left-size/2}px;
          top:${touch.clientY-rect.top-size/2}px;
          width:${size}px;height:${size}px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(124,92,255,0.18),rgba(49,225,192,0.08) 70%,transparent);
          transform:scale(0);opacity:1;pointer-events:none;
          animation:mob-ripple 0.55s ease forwards;
          z-index:0;
        `;
        el.style.position='relative';
        el.style.overflow='hidden';
        if(el.firstChild){el.insertBefore(ripple,el.firstChild);}else{el.appendChild(ripple);}
        setTimeout(function(){ripple.remove();},600);
      },{passive:true});
    });

    document.querySelectorAll('.contact-card').forEach(function(el){el.classList.add('mob-hidden');});
    document.querySelectorAll('.contact-socials a').forEach(function(el){el.classList.add('mob-hidden');});
    const contactObs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          const el=entry.target;
          const idx=Array.from(el.parentElement.children).indexOf(el);
          setTimeout(function(){el.classList.remove('mob-hidden');el.classList.add('mob-reveal');},idx*100);
          contactObs.unobserve(el);
        }
      });
    },{threshold:0.2});
    document.querySelectorAll('.contact-card,.contact-socials a').forEach(function(el){contactObs.observe(el);});

    const titleObs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('aos-animate');
          entry.target.classList.add('in-view');
        }
      });
    },{threshold:0.4});
    document.querySelectorAll('.section-title').forEach(function(t){titleObs.observe(t);});
  }
});