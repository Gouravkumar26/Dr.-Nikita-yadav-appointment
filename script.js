/* ==========================================================================
   Dr. Nitika Yadav — Premium Dermatology Website
   Vanilla JS: loader, scroll progress, cursor glow, nav, reveal, counters,
   tilt, magnetic + ripple buttons, testimonial slider, FAQ accordion,
   floating-label form validation + success animation.
   ========================================================================== */
 
document.addEventListener('DOMContentLoaded', () => {
 
    /* ---------------------------- Loading Screen ---------------------------- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => loader && loader.classList.add('hidden'), 2500);
 
    /* ---------------------------- Scroll Progress Bar ---------------------------- */
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    }
 
    /* ---------------------------- Navbar: scroll shadow + hamburger ---------------------------- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
 
    function updateNavbarState() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
 
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('menu-open');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });
 
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('menu-open');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });
 
    /* ---------------------------- Active Link Highlight on Scroll ---------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
 
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href').slice(1) === current);
        });
    }
 
    /* ---------------------------- Single rAF-driven scroll loop ---------------------------- */
    let scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavbarState();
                updateActiveLink();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
 
    /* ---------------------------- Cursor Glow (desktop only) ---------------------------- */
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        });
        window.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
    }
 
    /* ---------------------------- Scroll Reveal (IntersectionObserver) ---------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
 
    /* ---------------------------- Animated Stat Counters ---------------------------- */
    const statNumbers = document.querySelectorAll('.stat-box h3[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();
 
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));
 
    /* ---------------------------- Magnetic Buttons ---------------------------- */
    const magneticEls = document.querySelectorAll('.magnetic');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
 
    /* ---------------------------- Ripple Effect ---------------------------- */
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const circle = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            circle.className = 'ripple-circle';
            circle.style.width = circle.style.height = size + 'px';
            circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
            circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(circle);
            setTimeout(() => circle.remove(), 650);
        });
    });
 
    /* ---------------------------- Hero Image Tilt ---------------------------- */
    const tiltWrap = document.getElementById('tiltImage');
    if (tiltWrap && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const img = tiltWrap.querySelector('img');
        tiltWrap.addEventListener('mousemove', (e) => {
            const rect = tiltWrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        });
        tiltWrap.addEventListener('mouseleave', () => {
            img.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }
 
    /* ---------------------------- Testimonial Slider (auto-sliding) ---------------------------- */
    const track = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('sliderDots');
    if (track) {
        const slides = track.children.length;
        let index = 0;
 
        for (let i = 0; i < slides; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsWrap.appendChild(dot);
        }
        const dots = dotsWrap.querySelectorAll('.dot');
 
        function goToSlide(i) {
            index = i;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, di) => d.classList.toggle('active', di === index));
        }
 
        let autoSlide = setInterval(() => goToSlide((index + 1) % slides), 5000);
 
        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.parentElement.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide((index + 1) % slides), 5000);
        });
    }
 
    /* ---------------------------- FAQ Accordion ---------------------------- */
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
 
    /* ---------------------------- Floating-label select fill state ---------------------------- */
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function () {
            this.classList.toggle('filled', this.value !== '');
        });
    }
 
    /* ---------------------------- Appointment Form: validation + success ---------------------------- */
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const formWrap = document.querySelector('.appointment-form');
        const successMessage = document.getElementById('successMessage');
        const submitBtn = bookingForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.btn-spinner');
 
        const fields = {
            name: { el: document.getElementById('name'), validate: v => v.trim().length >= 2 },
            email: { el: document.getElementById('email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
            phone: { el: document.getElementById('phone'), validate: v => /^[0-9+\-\s]{7,15}$/.test(v) },
            service: { el: document.getElementById('service'), validate: v => v !== '' }
        };
 
        Object.values(fields).forEach(({ el }) => {
            el.addEventListener('blur', () => validateField(el));
            el.addEventListener('input', () => {
                if (el.closest('.form-group').classList.contains('invalid')) validateField(el);
            });
        });
 
        function validateField(el) {
            const key = el.id;
            const group = el.closest('.form-group');
            const isValid = fields[key].validate(el.value);
            group.classList.toggle('invalid', !isValid);
            return isValid;
        }
 
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
 
            let allValid = true;
            Object.values(fields).forEach(({ el }) => {
                if (!validateField(el)) allValid = false;
            });
            if (!allValid) return;
 
            const name = fields.name.el.value.trim();
            const serviceLabel = fields.service.el.options[fields.service.el.selectedIndex].text;
            const phone = fields.phone.el.value.trim();
 
            // Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            spinner.style.display = 'inline-block';
 
            setTimeout(() => {
                successMessage.textContent = `Thank you, ${name}! Your request for ${serviceLabel} has been received. We will call you shortly on ${phone}.`;
                formWrap.classList.add('submitted');
                submitBtn.disabled = false;
                btnText.textContent = 'Submit Request';
                spinner.style.display = 'none';
                bookingForm.reset();
                document.querySelectorAll('.form-group.invalid').forEach(g => g.classList.remove('invalid'));
                if (serviceSelect) serviceSelect.classList.remove('filled');
            }, 900);
        });
    }
 
});