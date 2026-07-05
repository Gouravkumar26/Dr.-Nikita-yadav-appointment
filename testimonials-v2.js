/* ==========================================================================
   Testimonials Redesign — Standalone Script
   --------------------------------------------------------------------------
   Kept completely separate from script.js. Handles the prev/next arrow
   navigation between stacked testimonial cards, plus a gentle auto-rotate
   that pauses on hover. No-ops safely if the markup isn't on the page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const wrap = document.querySelector('.testi-card-wrap');
    if (!wrap) {
        console.warn('[testimonials-v2] .testi-card-wrap not found — is the new testimonials HTML in the page?');
        return;
    }

    const cards = Array.from(wrap.querySelectorAll('.testi-card'));
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');

    if (!prevBtn || !nextBtn) {
        console.warn('[testimonials-v2] Arrow buttons #testiPrev / #testiNext not found in the DOM. Check the IDs match exactly.');
    }
    if (!cards.length) {
        console.warn('[testimonials-v2] No .testi-card elements found inside .testi-card-wrap.');
        return;
    }

    let index = cards.findIndex(c => c.classList.contains('active'));
    if (index === -1) index = 0;

    function showCard(newIndex) {
        cards[index].classList.remove('active');
        index = (newIndex + cards.length) % cards.length;
        cards[index].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { showCard(index - 1); restartAutoRotate(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { showCard(index + 1); restartAutoRotate(); });

    // Gentle auto-rotate, paused while the user is interacting with the card
    let autoRotate = setInterval(() => showCard(index + 1), 6000);

    function restartAutoRotate() {
        clearInterval(autoRotate);
        autoRotate = setInterval(() => showCard(index + 1), 6000);
    }

    wrap.addEventListener('mouseenter', () => clearInterval(autoRotate));
    wrap.addEventListener('mouseleave', restartAutoRotate);

});