document.addEventListener('DOMContentLoaded', () => {
  
  // ==============================================
  // Initialize AOS (Animate on Scroll)
  // ==============================================
  AOS.init({
    duration: 800, // slightly faster animation
    once: true,
  });

  // ==============================================
  // Theme Toggler
  // ==============================================
  const themeBtn = document.getElementById('themeBtn');
  
  const applyTheme = (theme) => {
      if (theme === 'light') {
          document.body.classList.add('light-theme');
          themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
          document.body.classList.remove('light-theme');
          themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    let currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    let newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==============================================
  // Hamburger Menu
  // ==============================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const toggleMenu = () => {
    const isActive = mobileMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

  // ==============================================
  // Typewriter Effect
  // ==============================================
  const typewriterEl = document.getElementById('typewriter');
  const words = ['Frontend Developer', 'Designer', 'Creative Thinker'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    let typeSpeed = isDeleting ? 100 : 200;

    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  type();
  
  // ==============================================
  // Active Nav Link on Scroll
  // ==============================================
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('nav a, .mobile-menu a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 70) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
  
  // ==============================================
  // Skill Bar & Counter Animation on Scroll
  // ==============================================
  const skills = document.querySelectorAll('.skill-card');

  const animateCounter = (el, target) => {
    let current = 0;
    const step = target / 100; // Animate in 100 steps
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(interval);
        el.textContent = `${target}%`;
      } else {
        el.textContent = `${Math.ceil(current)}%`;
      }
    }, 18); // Corresponds to ~1.8s total animation time
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillElement = entry.target;
        skillElement.classList.add('is-visible');
        
        const percentageEl = skillElement.querySelector('.skill-percentage');
        const targetLevel = skillElement.dataset.level;
        
        animateCounter(percentageEl, targetLevel);

        observer.unobserve(skillElement);
      }
    });
  }, { threshold: 0.5 });

  skills.forEach(skill => {
    skillObserver.observe(skill);
  });

  // ==============================================
  // Project Modal Logic
  // ==============================================
  const projectModal = document.getElementById('projectModal');
  const modalWindow = projectModal.querySelector('.modal-window');
  const projectFrame = document.getElementById('projectFrame');
  const modalTitle = projectModal.querySelector('.modal-title');
  const projectLinks = document.querySelectorAll('.project-btn.demo-btn[data-url]');

  const openModal = (url, title) => {
    if (url && url !== '#') {
        projectFrame.src = url;
        modalTitle.textContent = title;
        projectModal.classList.add('active');
        document.body.classList.add('modal-open');
    }
  };

  const closeModal = () => {
    projectModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    projectFrame.src = ''; // Clear iframe to stop content
    modalWindow.classList.remove('maximized', 'minimized');
  };

  projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.dataset.url;
      const title = link.closest('.project-card').querySelector('h3').textContent;
      openModal(url, title);
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeModal();
    }
  });

  document.getElementById('modalMaximize').addEventListener('click', () => {
    modalWindow.classList.toggle('maximized');
    modalWindow.classList.remove('minimized');
  });
  
  document.getElementById('modalMinimize').addEventListener('click', () => {
    modalWindow.classList.toggle('minimized');
    modalWindow.classList.remove('maximized');
  });

});
