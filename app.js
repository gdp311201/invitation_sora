import { CONFIG } from './config.js';
import { setupMusic } from './music.js';
import { initSnapScroll, unlockScroll } from './snap-scroll.js';
import { initRSVP } from './rsvp.js';
import { initCountdown } from './countdown.js';
import { initGift } from './gift.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('App Initialized for:', CONFIG.COUPLE_NAME);

  // Setup URL Params untuk Guest Name
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  if (guestName) {
    const guestElem = document.getElementById('guest-name');
    if (guestElem) guestElem.textContent = decodeURIComponent(guestName);
  }

  // Handle Open Invitation Button Click
  const btnOpen = document.getElementById('btn-open-invitation');
  const musicToggle = document.getElementById('music-toggle');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // 1. Unlock Body Scroll
      document.body.classList.remove('is-locked');
      
      // 2. Play Audio & Show Toggle Button
      const { playMusic } = setupMusic();
      playMusic();
      if (musicToggle) musicToggle.classList.remove('hidden');

      // 3. Smooth Scroll to Next Section
      const quoteSection = document.getElementById('quote');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }

      // 4. Init Snap Scroll
      initSnapScroll();
    });
  }

  // Initialize Other Modules
  initRSVP();
  initCountdown();
  initGift();
});
