document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS
    AOS.init({
        duration: 800,
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
    const words = ['Frontend Developer', 'UI/UX Designer', 'Software Engineer'];
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
            if (window.pageYOffset >= sectionTop - 70) {
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
    // Skill Bar Animation
    // ==============================================
    const skillCards = document.querySelectorAll('.skill-card');

    const animateCounter = (el, target) => {
        let current = 0;
        const targetNum = parseInt(target);
        const step = targetNum / 50; 
        const interval = setInterval(() => {
            current += step;
            if (current >= targetNum) {
                clearInterval(interval);
                el.textContent = `${targetNum}%`;
            } else {
                el.textContent = `${Math.ceil(current)}%`;
            }
        }, 30);
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

    skillCards.forEach(skill => skillObserver.observe(skill));

    // ==============================================
    // Project Filtering Logic
    // ==============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.dataset.target;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (target === 'all' || category === target) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Refresh AOS for visible elements
            AOS.refresh();
        });
    });

    // ==============================================
    // Contact Form & WhatsApp Integration
    // ==============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('from_name').value;
            const email = document.getElementById('email_id').value;
            const message = document.getElementById('message').value;
            const myPhoneNumber = "919952876478"; 
            
            const whatsappMsg = `Hello! I'm ${name} (${email}). %0A%0AMessage: %0A${message}`;
            const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${whatsappMsg}`;

            // EmailJS Logic
            emailjs.sendForm('service_dtquy6q', 'template_YOUR_TEMPLATE_ID', this)
                .then(() => {
                    // Custom message instead of alert
                    console.log('Email sent successfully');
                    contactForm.reset();
                    window.open(whatsappUrl, '_blank');
                }, (error) => {
                    console.error('Email failed, falling back to WhatsApp', error);
                    window.open(whatsappUrl, '_blank');
                });
        });
    }

});
