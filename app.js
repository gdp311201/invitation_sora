/**
 * js/app.js
 * Main Entry Point Undangan Digital
 */

import { CONFIG } from './config.js';
import { setupMusic } from './music.js';
import { initSnapScroll, unlockScroll } from './snap-scroll.js';
import { initRSVP } from './rsvp.js';
import { initCountdown } from './countdown.js';
import { initGift } from './gift.js';

document.addEventListener('DOMContentLoaded', () => {
  // Ambil nama pasangan dari CONFIG secara aman
  const groom = CONFIG.couple?.groom?.shortName || 'Groom';
  const bride = CONFIG.couple?.bride?.shortName || 'Bride';
  console.log('App Initialized for:', `${groom} & ${bride}`);

  // 1. Setup URL Params untuk Guest Name (?to=Nama atau ?guest=Nama)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  if (guestName) {
    const guestElem = document.getElementById('guest-name');
    if (guestElem) {
      guestElem.textContent = decodeURIComponent(guestName);
    }
  }

  // 2. Setup Pemutar Musik
  const { playMusic } = setupMusic();

  // 3. Handle Open Invitation Button Click
  const btnOpen = document.getElementById('btn-open-invitation');
  const musicToggle = document.getElementById('music-toggle');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Unlock Body Scroll
      document.body.classList.remove('is-locked');
      if (typeof unlockScroll === 'function') {
        unlockScroll();
      }

      // Play Audio & Tampilkan Tombol Toggle Musik
      playMusic();
      if (musicToggle) {
        musicToggle.classList.remove('hidden');
      }

      // Smooth Scroll ke Section Pertama (Fallback ke #opening atau #couple jika #quote tidak ada)
      const targetSection = document.getElementById('quote') || document.getElementById('opening') || document.getElementById('couple');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Inisialisasi Snap Scroll setelah undangan dibuka
      initSnapScroll();
    });
  }

  // 4. Initialize Other Modules
  initRSVP();
  initCountdown();
  initGift();
});
