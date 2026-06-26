(function(){emailjs.init({publicKey:"YOUR_PUBLIC_KEY"});})();


document.addEventListener('DOMContentLoaded',()=>{
  AOS.init({duration:800,once:true});

  /* Theme */
  const themeBtn=document.getElementById('themeBtn');
  const applyTheme=t=>{
    if(t==='light'){document.body.classList.add('light-theme');themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';}
    else{document.body.classList.remove('light-theme');themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';}
  };
  applyTheme(localStorage.getItem('theme')||'dark');
  themeBtn.addEventListener('click',()=>{
    const n=document.body.classList.contains('light-theme')?'dark':'light';
    applyTheme(n);localStorage.setItem('theme',n);
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

  /* ===== STABLE TYPEWRITER — natural variable speed, zero layout shift ===== */
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

  /* Active nav on scroll + desktop header glass effect */
  const sections=document.querySelectorAll('main section');
  const allNavLinks=document.querySelectorAll('nav a, .mobile-menu a');
  const hdrEl=document.querySelector('header');
  window.addEventListener('scroll',()=>{
    /* Header glass */
    if(window.scrollY>40){hdrEl.classList.add('scrolled');}
    else{hdrEl.classList.remove('scrolled');}
    
    /* Active section */
    let current='';
    sections.forEach(s=>{if(pageYOffset>=s.offsetTop-100)current=s.getAttribute('id');});
    allNavLinks.forEach(link=>{
      link.classList.remove('active');
      const href=(link.getAttribute('href')||'').replace('#','');
      if(href===current)link.classList.add('active');
    });
  },{passive:true});

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

  /* Section title underline — triggers .in-view on scroll */
  const titleObs2=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.5});
  document.querySelectorAll('.section-title').forEach(t=>titleObs2.observe(t));

  /* Stat box number pop on hover — retrigger animation */
  document.querySelectorAll('.stat-box').forEach(box=>{
    box.addEventListener('mouseenter',()=>{
      const num=box.querySelector('.number');
      num.style.animation='none';
      void num.offsetWidth;
      num.style.animation='stat-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });

  /* Social icons — pop animation retrigger */
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
      /* Retrigger bounce animation */
      btn.style.animation='none';
      void btn.offsetWidth;
      btn.style.animation='filter-bounce 0.35s cubic-bezier(0.34,1.56,0.64,1) both';
      const target=btn.dataset.target;
      projectCards.forEach(card=>{
        card.classList.toggle('hidden',target!=='all'&&card.dataset.category!==target);
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
    /* Touch ripple on cards */
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

    /* Contact cards — animate on scroll into view */
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

    /* Section title underline on scroll */
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
