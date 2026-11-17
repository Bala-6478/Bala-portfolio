document.documentElement.classList.add('is-loading');


    /* Apply saved theme BEFORE first paint (prevents dark->light flash) */
    (function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light-theme');}}catch(e){}})();
  

(function(){emailjs.init({publicKey:"YOUR_PUBLIC_KEY"});})();


document.addEventListener('DOMContentLoaded',()=>{
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  AOS.init({duration:750,once:true,offset:70,easing:'ease-out-cubic',disable:()=>reduceMotion});

  /* ===== TOAST HELPER ===== */
  const toastEl=document.getElementById('toast');
  const toastMsg=document.getElementById('toastMsg');
  let toastTimer;
  function showToast(msg){
    if(!toastEl) return;
    toastMsg.textContent=msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toastEl.classList.remove('show'),3400);
  }

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
    if(document.readyState==='complete'){ setTimeout(finish,550); }
    else{ window.addEventListener('load',()=>setTimeout(finish,350)); }
    setTimeout(finish,3800);
  })();

  /* ===== THEME — Dark <-> Light ===== */
  const root=document.documentElement;
  const themeBtn=document.getElementById('themeBtn');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const THEME_COLORS={dark:'#090b10',light:'#f8fafc'};
  const themeIcons={dark:'fa-moon',light:'fa-sun'};
  let themeTimer;
  function applyTheme(t,animate){
    if(animate&&!reduceMotion){
      root.classList.add('theme-switching');
      clearTimeout(themeTimer);
      themeTimer=setTimeout(()=>root.classList.remove('theme-switching'),450);
    }
    root.classList.toggle('light-theme',t==='light');
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

  /* ===== INTERACTIVE CONSTELLATION PARTICLE NETWORK BACKGROUND ===== */
  (function(){
    const canvas=document.getElementById('bgParticleCanvas');
    if(!canvas||reduceMotion) return;
    const ctx=canvas.getContext('2d');
    let w=0,h=0,particles=[];
    const mouse={x:-9999,y:-9999};

    function resize(){
      w=canvas.width=window.innerWidth;
      h=canvas.height=window.innerHeight;
      const count=window.innerWidth<780 ? 22 : 48;
      particles=Array.from({length:count},()=>({
        x:Math.random()*w,
        y:Math.random()*h,
        vx:(Math.random()-0.5)*0.35,
        vy:(Math.random()-0.5)*0.35,
        r:Math.random()*1.6+0.8,
        alpha:Math.random()*0.5+0.25
      }));
    }
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
    window.addEventListener('mouseleave',()=>{mouse.x=-9999;mouse.y=-9999;});

    function draw(){
      ctx.clearRect(0,0,w,h);
      const isLight=root.classList.contains('light-theme');
      const dotRGB=isLight?'109,74,255':'148,125,255';
      const lineRGB=isLight?'2,132,199':'56,189,248';

      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        p.x+=p.vx;
        p.y+=p.vy;
        if(p.x<0) p.x=w; else if(p.x>w) p.x=0;
        if(p.y<0) p.y=h; else if(p.y>h) p.y=0;

        /* Subtle repulsion/attraction to cursor */
        const dxM=mouse.x-p.x, dyM=mouse.y-p.y;
        const distM=Math.hypot(dxM,dyM);
        if(distM<150){
          const alpha=(1-distM/150)*0.38;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(mouse.x,mouse.y);
          ctx.strokeStyle=`rgba(${dotRGB},${alpha.toFixed(3)})`;
          ctx.lineWidth=0.9;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${dotRGB},${p.alpha})`;
        ctx.fill();

        for(let j=i+1;j<particles.length;j++){
          const q=particles[j];
          const dx=p.x-q.x, dy=p.y-q.y;
          const dist=Math.hypot(dx,dy);
          if(dist<125){
            const a=(1-dist/125)*0.16;
            ctx.beginPath();
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(q.x,q.y);
            ctx.strokeStyle=`rgba(${lineRGB},${a.toFixed(3)})`;
            ctx.lineWidth=0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ===== SMOOTH SPRING CURSOR AURA + CARD SPOTLIGHT + 3D TILT ===== */
  const cursorAura=document.getElementById('bgCursorAura');
  if(window.matchMedia('(pointer: fine)').matches && !reduceMotion){
    let targetX=window.innerWidth*0.5, targetY=window.innerHeight*0.3;
    let curX=targetX, curY=targetY;
    window.addEventListener('mousemove',e=>{
      targetX=e.clientX;
      targetY=e.clientY;
    },{passive:true});

    (function smoothAura(){
      curX+=(targetX-curX)*0.12;
      curY+=(targetY-curY)*0.12;
      if(cursorAura){
        cursorAura.style.setProperty('--cursor-x', curX.toFixed(1) + 'px');
        cursorAura.style.setProperty('--cursor-y', curY.toFixed(1) + 'px');
      }
      requestAnimationFrame(smoothAura);
    })();

    document.querySelectorAll('.spotlight-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const rect=card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });

    document.querySelectorAll('.tilt-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const rect=card.getBoundingClientRect();
        const x=(e.clientX - rect.left)/rect.width - 0.5;
        const y=(e.clientY - rect.top)/rect.height - 0.5;
        card.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave',()=>{
        card.style.transform='';
      });
    });

    document.querySelectorAll('.magnetic').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const rect=btn.getBoundingClientRect();
        const dx=(e.clientX - (rect.left + rect.width/2))*0.18;
        const dy=(e.clientY - (rect.top + rect.height/2))*0.18;
        btn.style.transform=`translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('mouseleave',()=>{
        btn.style.transform='';
      });
    });
  }

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

  /* ===== SMOOTH SCROLL WITH HEADER OFFSET ===== */
  const headerEl=document.querySelector('header');
  function scrollToHash(hash,smooth){
    if(!hash||hash==='#'){return false;}
    const target=document.querySelector(hash);
    if(!target){return false;}
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
    if(paused){paused=false;del=true;sp=2200;setTimeout(type,sp);return;}
    if(del){
      tw.textContent=w.substring(0,ci-1);ci--;
      sp=38+Math.random()*28;
    } else {
      tw.textContent=w.substring(0,ci+1);ci++;
      sp=85+Math.random()*55;
    }
    if(!del&&ci===w.length){paused=true;sp=100;}
    else if(del&&ci===0){del=false;wi=(wi+1)%words.length;sp=400;}
    setTimeout(type,sp);
  }
  type();

  /* ===== SCROLL ENGINE ===== */
  const sections=Array.from(document.querySelectorAll('main section[id]'));
  const allNavLinks=document.querySelectorAll('nav a, .mobile-menu a');
  const progressEl=document.getElementById('scrollProgress');
  const toTop=document.getElementById('toTop');
  const bgDotMatrix=document.getElementById('bgDotMatrix');
  let ticking=false,lastActive='';
  function onScroll(){
    const y=window.pageYOffset||document.documentElement.scrollTop||0;
    const docH=document.documentElement.scrollHeight-window.innerHeight;
    const p=docH>0?Math.min(1,Math.max(0,y/docH)):0;
    progressEl.style.transform='scaleX('+p+')';
    headerEl.classList.toggle('scrolled',y>40);
    toTop.classList.toggle('show',y>600);
    if(bgDotMatrix&&!reduceMotion){bgDotMatrix.style.setProperty('--py',y+'px');}

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

  /* ===== PROJECTS HORIZONTAL SCROLL CAROUSEL + FILTERS ===== */
  const filterBtns=document.querySelectorAll('.filter-btn');
  const projectCards=Array.from(document.querySelectorAll('.project-card'));
  const track=document.getElementById('projectsTrack');
  const prevBtn=document.getElementById('projPrev');
  const nextBtn=document.getElementById('projNext');
  const progressFill=document.getElementById('projProgressFill');
  const dotsWrap=document.getElementById('projDots');

  function getVisibleCards(){
    return projectCards.filter(c=>!c.classList.contains('hidden'));
  }

  function buildDots(){
    if(!dotsWrap) return;
    const vis=getVisibleCards();
    dotsWrap.innerHTML='';
    vis.forEach((card,idx)=>{
      const dot=document.createElement('button');
      dot.className='carousel-dot'+(idx===0?' active':'');
      dot.setAttribute('aria-label','Go to project '+(idx+1));
      dot.addEventListener('click',()=>{
        track.scrollTo({left:card.offsetLeft - track.offsetLeft, behavior:'smooth'});
      });
      dotsWrap.appendChild(dot);
    });
  }

  function updateCarouselUI(){
    if(!track) return;
    const maxScroll=track.scrollWidth - track.clientWidth;
    const current=track.scrollLeft;
    const ratio=maxScroll>0 ? Math.min(1,Math.max(0,current/maxScroll)) : 1;
    if(progressFill){
      progressFill.style.width=(maxScroll>0 ? Math.max(15, ratio*100) : 100)+'%';
    }
    if(prevBtn) prevBtn.disabled = current <= 6;
    if(nextBtn) nextBtn.disabled = current >= maxScroll - 6;

    const vis=getVisibleCards();
    const dots=dotsWrap ? Array.from(dotsWrap.children) : [];
    if(vis.length && dots.length){
      let activeIdx=0;
      let minDiff=Infinity;
      vis.forEach((c,i)=>{
        const diff=Math.abs((c.offsetLeft - track.offsetLeft) - current);
        if(diff<minDiff){minDiff=diff;activeIdx=i;}
      });
      dots.forEach((d,i)=>d.classList.toggle('active',i===activeIdx));
    }
  }

  if(track){
    track.addEventListener('scroll',()=>requestAnimationFrame(updateCarouselUI),{passive:true});
    window.addEventListener('resize',()=>requestAnimationFrame(updateCarouselUI));

    const getStep=()=>{
      const first=getVisibleCards()[0];
      return first ? first.offsetWidth + 24 : 360;
    };
    if(prevBtn) prevBtn.addEventListener('click',()=>track.scrollBy({left:-getStep(),behavior:'smooth'}));
    if(nextBtn) nextBtn.addEventListener('click',()=>track.scrollBy({left:getStep(),behavior:'smooth'}));

    /* Mouse drag-to-scroll on desktop */
    let isDown=false,startX=0,scrollLeftStart=0,dragged=false;
    track.addEventListener('mousedown',e=>{
      if(e.target.closest('a,button')) return;
      isDown=true;dragged=false;
      track.classList.add('is-dragging');
      startX=e.pageX - track.offsetLeft;
      scrollLeftStart=track.scrollLeft;
    });
    window.addEventListener('mouseup',()=>{
      if(!isDown) return;
      isDown=false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('mousemove',e=>{
      if(!isDown) return;
      e.preventDefault();
      const x=e.pageX - track.offsetLeft;
      const walk=(x - startX)*1.35;
      if(Math.abs(walk)>6) dragged=true;
      track.scrollLeft=scrollLeftStart - walk;
    });
    track.addEventListener('click',e=>{
      if(dragged){e.preventDefault();e.stopPropagation();dragged=false;}
    },true);

    buildDots();
    updateCarouselUI();
  }

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
      if(track) track.scrollTo({left:0,behavior:'smooth'});
      buildDots();
      setTimeout(updateCarouselUI,60);
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
      .then(()=>{showToast('Message sent! Opening WhatsApp...');this.reset();window.open(url,'_blank');},
            ()=>{showToast('Opening WhatsApp to send your message...');window.open(url,'_blank');});
  });
});
