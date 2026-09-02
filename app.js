import { CONFIG } from './config.js';
import { initMusic } from './music.js';
import { initSnapScroll, unlockScroll } from './snap-scroll.js';
import { initRSVP } from './rsvp.js';
import { initCountdown } from './countdown.js';
import { initGift } from './gift.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('App Initialized for:', CONFIG.COUPLE_NAME || 'Wedding');

  // 1. Guest Name URL Param
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  if (guestName) {
    const guestElem = document.getElementById('guest-name');
    if (guestElem) guestElem.textContent = decodeURIComponent(guestName);
  }

  // 2. Init Musik
  initMusic();

  // 3. Open Invitation Handler
  const btnOpen = document.getElementById('btn-open-invitation');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Sync penguncian scroll untuk layout.css dan sections.css
      document.body.classList.remove('is-locked');
      document.body.classList.add('cover-dismissed');
      document.documentElement.style.overflow = 'auto';

      // Trigger event pembukaan musik
      window.dispatchEvent(new Event('cover:opened'));

      // Smooth scroll ke section quote/first section
      const quoteSection = document.getElementById('quote');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }

      initSnapScroll();
    });
  }

  // 4. Init Modul Lainnya
  initRSVP();
  initCountdown();
  initGift();
});
