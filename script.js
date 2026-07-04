/* ==========================================================================
   Dr. Nitika Yadav — Premium Dermatology Website
   Vanilla JS + GSAP/ScrollTrigger: loader, custom cursor, split-text hero
   sequence, ambient particle field, magnetic + tilt interactions, scroll
   reveals, testimonial slider, FAQ accordion, floating-label form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hasGsap = typeof gsap !== 'undefined';
    const hasSplitType = typeof SplitType !== 'undefined';
    if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* ---------------------------- Loading Screen ---------------------------- */
    const loader = document.getElementById('loader');
    function hideLoader() {
        if (!loader) return;
        loader.classList.add('hidden');
        playHeroSequence();
    }
    window.addEventListener('load', () => setTimeout(hideLoader, 500));
    setTimeout(() => { if (loader && !loader.classList.contains('hidden')) hideLoader(); }, 2500);

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

    /* ---------------------------- Custom Magnetic Cursor ---------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorGlow = document.getElementById('cursorGlow');

    if (isFinePointer && !prefersReducedMotion && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            cursorDot.classList.add('active');
            cursorRing.classList.add('active');
            if (cursorGlow) {
                cursorGlow.style.left = mouseX + 'px';
                cursorGlow.style.top = mouseY + 'px';
                cursorGlow.classList.add('active');
            }
        });
        window.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorRing.classList.remove('active');
            if (cursorGlow) cursorGlow.classList.remove('active');
        });

        function ringLoop() {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(ringLoop);
        }
        ringLoop();

        const darkSections = document.querySelectorAll('.testimonials, .contact-info, .site-footer');
        const hoverables = document.querySelectorAll('a, button, .service-card, .faq-question, input, select, [data-cursor="link"]');

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });

        const darkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cursorRing.classList.add('on-dark');
                    cursorDot.classList.add('on-dark');
                }
            });
        }, { threshold: 0.4 });
        darkSections.forEach(sec => darkObserver.observe(sec));

        // Toggle back to light cursor once we leave all dark sections
        window.addEventListener('scroll', () => {
            const inDark = [...darkSections].some(sec => {
                const rect = sec.getBoundingClientRect();
                return rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
            });
            cursorRing.classList.toggle('on-dark', inDark);
            cursorDot.classList.toggle('on-dark', inDark);
        });
    } else if (cursorGlow) {
        cursorGlow.remove();
    }

    /* ---------------------------- Hero Split-Text + Load Sequence (GSAP) ---------------------------- */
    function splitChars(el) {
        const text = el.textContent;
        el.innerHTML = '';
        const frag = document.createDocumentFragment();
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            frag.appendChild(span);
        });
        el.appendChild(frag);
        return el.querySelectorAll('.char');
    }

    // Prepare split text ahead of time so layout is correct before animating
    const heroTitle = document.querySelector('[data-title]');
    let heroChars = [];
    if (heroTitle) {
        // Split each text node's line separately, preserving the <br> and <span class="highlight">
        const walker = document.createTreeWalker(heroTitle, NodeFilter.SHOW_TEXT, null);
        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);
        nodes.forEach(node => {
            if (!node.textContent.trim()) return;
            const span = document.createElement('span');
            span.textContent = node.textContent;
            node.parentNode.replaceChild(span, node);
            const chars = splitChars(span);
            heroChars.push(...chars);
        });
    }

    let heroSequencePlayed = false;
    function playHeroSequence() {
        if (heroSequencePlayed) return;
        heroSequencePlayed = true;

        if (prefersReducedMotion) {
            document.querySelectorAll('.hero-anim, .char').forEach(el => { el.style.opacity = 1; });
            return;
        }

        if (!hasGsap) {
            document.querySelectorAll('.hero-anim').forEach(el => { el.style.opacity = 1; });
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (heroChars.length) {
            gsap.set(heroChars, { opacity: 0, y: 28, rotateX: -40 });
            tl.to(heroChars, {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.7,
                stagger: 0.018,
            }, 0.1);
        }

        tl.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.7)
          .fromTo('.trust-badges', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.82)
          .fromTo('.hero-image', { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, 0.3);
    }
    // Fallback: if load event is slow, still reveal hero content
    setTimeout(playHeroSequence, 2600);

    /* ---------------------------- About: Heading → Paragraph Word Reveal (GSAP + SplitType) ---------------------------- */
    // The About heading ("Meet Dr. Nitika Yadav, MD") reveals one word at a
    // time; once every heading word is in, the paragraph beneath it starts
    // its own word-by-word reveal using the same animation. Both are driven
    // by a single GSAP timeline so the paragraph is guaranteed to start only
    // after the heading has finished, on one shared scroll trigger.
    function initAboutWordReveal() {
        const heading = document.querySelector('[data-word-reveal-heading]');
        const paragraph = document.querySelector('.about-content [data-word-reveal]');
        if (!heading || !paragraph) return false;

        if (prefersReducedMotion || !hasGsap || !hasSplitType) {
            heading.style.opacity = 1;
            paragraph.style.opacity = 1;
            return true;
        }

        heading.style.opacity = 1;
        paragraph.style.opacity = 1;

        const headingSplit = new SplitType(heading, { types: 'words', tagName: 'span' });
        const paragraphSplit = new SplitType(paragraph, { types: 'words', tagName: 'span' });

        if (!headingSplit.words || !headingSplit.words.length || !paragraphSplit.words || !paragraphSplit.words.length) {
            return true;
        }

        gsap.set(headingSplit.words, { opacity: 0, y: 22 });
        gsap.set(paragraphSplit.words, { opacity: 0, y: 22 });

        gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        })
        .to(headingSplit.words, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.12
        })
        .to(paragraphSplit.words, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.045
        }, '+=0.15'); // paragraph only begins once every heading word has landed

        return true;
    }
    const aboutHandled = initAboutWordReveal();

    /* ---------------------------- Hero Badge: Word-by-word Reveal + Shimmer (GSAP + SplitType) ---------------------------- */
    // The "Board-Certified · AIIMS Delhi" hero badge reveals word-by-word via
    // ScrollTrigger (consistent with the rest of the site's reveal system),
    // then once every word has landed, a one-pass-per-cycle light shimmer
    // sweeps across the text to give it a premium, polished finish.
    function initHeroBadgeReveal() {
        const badge = document.querySelector('[data-hero-badge-reveal]');
        if (!badge) return;

        if (prefersReducedMotion || !hasGsap || !hasSplitType) {
            badge.style.opacity = 1;
            return;
        }

        badge.style.opacity = 1;

        const badgeSplit = new SplitType(badge, { types: 'words', tagName: 'span' });
        if (!badgeSplit.words || !badgeSplit.words.length) {
            return;
        }

        gsap.set(badgeSplit.words, { opacity: 0, y: 18 });

        gsap.timeline({
            scrollTrigger: {
                trigger: badge,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            onComplete: () => badge.classList.add('shimmer')
        }).to(badgeSplit.words, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1
        });
    }
    initHeroBadgeReveal();

    /* ---------------------------- Word-by-word Reveal (GSAP + SplitType) ---------------------------- */
    // Applies to remaining [data-word-reveal] paragraphs (currently the hero
    // intro). Words are split individually, fade + translateY in one at a
    // time on scroll, and previously revealed words are left untouched (no
    // exit animation), so the whole paragraph builds up and stays visible.
    function initWordReveal() {
        const wordRevealEls = Array.from(document.querySelectorAll('[data-word-reveal]'))
            .filter(el => !(aboutHandled && el.closest('.about-content')));
        if (!wordRevealEls.length) return;

        // Graceful fallback: just show the text if a dependency is missing
        // or the user prefers reduced motion.
        if (prefersReducedMotion || !hasGsap || !hasSplitType) {
            wordRevealEls.forEach(el => { el.style.opacity = 1; });
            return;
        }

        wordRevealEls.forEach(el => {
            // The paragraph's own opacity is now controlled per-word, so make
            // the container visible immediately and let the words handle it.
            el.style.opacity = 1;

            const split = new SplitType(el, { types: 'words', tagName: 'span' });
            if (!split.words || !split.words.length) return;

            gsap.set(split.words, { opacity: 0, y: 26 });

            gsap.to(split.words, {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power3.out',
                stagger: 0.09,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }
    initWordReveal();

    /* ---------------------------- Ambient Particle Field (hero canvas) ---------------------------- */
    const canvas = document.getElementById('particleField');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        const hero = canvas.closest('.hero');
        let particles = [];
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resizeCanvas() {
            const rect = hero.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.max(24, Math.round(rect.width / 40));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                r: Math.random() * 1.8 + 0.6,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                a: Math.random() * 0.4 + 0.15,
            }));
        }

        function drawParticles() {
            const rect = hero.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = rect.width;
                if (p.x > rect.width) p.x = 0;
                if (p.y < 0) p.y = rect.height;
                if (p.y > rect.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168, 118, 69, ${p.a})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        drawParticles();
        window.addEventListener('resize', resizeCanvas);
    }

    /* ---------------------------- Aurora Parallax on Mouse Move ---------------------------- */
    const aurora = document.getElementById('auroraLayer');
    if (aurora && isFinePointer && !prefersReducedMotion) {
        const heroEl = document.getElementById('home');
        heroEl.addEventListener('mousemove', (e) => {
            const rect = heroEl.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            aurora.style.transform = `translate(${x * 24}px, ${y * 24}px)`;
        });
        heroEl.addEventListener('mouseleave', () => {
            aurora.style.transform = 'translate(0, 0)';
        });
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
    if (isFinePointer) {
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
    if (tiltWrap && isFinePointer) {
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

    /* ---------------------------- Generic Tilt Cards (about image, service cards) ---------------------------- */
    if (isFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('[data-tilt-card]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * 8;
                const ry = (x - 0.5) * 8;
                card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
                card.style.setProperty('--mx', (x * 100) + '%');
                card.style.setProperty('--my', (y * 100) + '%');
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    /* ---------------------------- GSAP Scroll-Triggered Section Motion ---------------------------- */
    if (hasGsap && window.ScrollTrigger && !prefersReducedMotion) {
        gsap.utils.toArray('.services-grid .service-card').forEach((card, i) => {
            gsap.fromTo(card, { y: 60, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.08, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%' }
            });
        });

        gsap.to('.blob-1', {
            y: -60, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.blob-2', {
            y: 60, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
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