// Mobile Menu Toggle (Hamburger Menu)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Toggle Icon between Bars and X
    const icon = hamburger.querySelector('i');
    if(icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});

// Active Link Highlight on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Appointment Form Submission Handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get values from form
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;

    // Simple alert feedback for user
    alert(`Thank you, ${name}! Your appointment request for ${service} treatment has been received. We will call you shortly on ${phone}.`);

    // Reset the form
    this.reset();
});

// ===== Motion & Hover Enhancements =====

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll-reveal using IntersectionObserver (no library)
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // animate once
        }
    });
}, {
    threshold: 0.15
});

revealEls.forEach(el => revealObserver.observe(el));

// Animated counter for stats (10+, 5000+, etc.)
const statNumbers = document.querySelectorAll('.stat-box h3');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            const match = text.match(/\d+/);
            if (match) {
                const target = parseInt(match[0], 10);
                const suffix = text.replace(match[0], '');
                let current = 0;
                const increment = Math.max(target / 40, 1);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current) + suffix;
                }, 30);
            }
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));



const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
});

document.querySelectorAll(".reveal, .reveal-left, .reveal-right")
.forEach(el => observer.observe(el));