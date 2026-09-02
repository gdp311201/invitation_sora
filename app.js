/* ============================================================
   APP.JS — Entry point, inisialisasi semua modul
   
   Urutan eksekusi:
   1. Set CSS variables dari config (hero image, dll)
   2. Render nav buttons dari config
   3. Update preloader teks dari config
   4. Handle URL params (guest name, session, code)
   5. Tampilkan cover setelah preloader selesai
   6. Handle cover dismiss (OPEN INVITATION)
   7. Handle frame popup close
   8. Init countdown timer
   9. Init semua sub-modul (animations, music, snap, rsvp, gift)
  10. Prevent scroll restoration
   ============================================================ */

import { CONFIG } from './config.js';
import { initAnimations } from './animations.js';
import { initSnapScroll } from './snap-scroll.js';
import { initMusic } from './music.js';
import { initRsvp } from './rsvp.js';
import { initGift } from './gift.js';


/* ─── 1. CSS VARIABLES dari config ──────────────────────────────── */
function setConfigVariables() {
  const root = document.documentElement;

  // Hero image — dipakai oleh cover-left__bg dan cover-right
  if (CONFIG.images.hero) {
    root.style.setProperty('--hero-image', `url(${CONFIG.images.hero})`);
  }

  // Accent color (untuk masa depan kalau mau ACP)
  root.style.setProperty('--color-accent', CONFIG.couple?.hashtag
    ? '#F1C193' // default, akan diganti jika ACP diaktifkan
    : '#F1C193');
}


/* ─── 2. RENDER NAV BUTTONS ──────────────────────────────────────── */
function renderNavButtons() {
  const nav = document.getElementById('cover-nav');
  if (!nav || !CONFIG.nav?.items) return;

  CONFIG.nav.items.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.target;
    a.className = 'cover-nav__link';
    a.textContent = item.label;
    nav.appendChild(a);
  });
}


/* ─── 3. UPDATE PRELOADER dari config ────────────────────────────── */
function updatePreloader() {
  const namesEl = document.getElementById('preloader-names');
  const initialsEl = document.getElementById('preloader-initials');

  if (namesEl && CONFIG.couple) {
    namesEl.textContent = `${CONFIG.couple.groom.shortName} & ${CONFIG.couple.bride.shortName}`;
  }

  if (initialsEl && CONFIG.couple) {
    const g = CONFIG.couple.groom.shortName.charAt(0);
    const b = CONFIG.couple.bride.shortName.charAt(0);
    initialsEl.textContent = `${g} & ${b}`;
  }
}


/* ─── 4. URL PARAMS ───────────────────────────────────────────── */
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);

  // Guest name → tampilkan di cover
  const name = params.get('name');
  if (name) {
    const guestEl = document.getElementById('guest-name');
    if (guestEl) {
      guestEl.textContent = decodeURIComponent(name);
    }
    // Juga simpan di hidden data element untuk RSVP
    const guestData = document.getElementById('guest-data');
    if (guestData) {
      guestData.dataset.name = decodeURIComponent(name);
    }
  }

  // Guest code → simpan untuk RSVP
  const code = params.get('code');
  if (code) {
    const guestData = document.getElementById('guest-data');
    if (guestData) {
      guestData.dataset.code = code;
    }
  }

  // Session switch → ganti waktu reception
  if (params.get('s') === '2') {
    const sessionTime = document.getElementById('session-time');
    if (sessionTime && sessionTime.dataset.session2) {
      sessionTime.textContent = sessionTime.dataset.session2;
    }
  }
}


/* ─── 5. SHOW COVER setelah preloader selesai ──────────────────── */
function showCoverWhenReady() {
  const coverSection = document.getElementById('cover-section');

  // Preloader sudah hilang? Langsung tampilkan
  if (!document.getElementById('preloader')) {
    if (coverSection) coverSection.style.display = '';
    return;
  }

  // Preloader masih ada — tunggu sampai dihapus dari DOM
  const observer = new MutationObserver((mutations, obs) => {
    if (!document.getElementById('preloader')) {
      obs.disconnect();
      if (coverSection) coverSection.style.display = '';
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}


/* ─── 6. COVER DISMISS — OPEN INVITATION ───────────────────────── */
function initCoverDismiss() {
  const openBtn = document.getElementById('open-invitation');
  const coverLeft = document.getElementById('cover-left');
  const coverSection = document.getElementById('cover-section');

  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    // Scroll ke atas dulu
    window.scrollTo(0, 0);

    // Hide cover left
    if (coverLeft) {
      coverLeft.style.display = 'none';
    }

    // Fade out cover right, lalu display:none setelah transisi
    if (coverSection) {
      coverSection.style.transition = 'opacity 0.6s ease';
      coverSection.style.opacity = '0';

      setTimeout(() => {
        coverSection.style.display = 'none';
        coverSection.style.opacity = '';
        coverSection.style.transition = '';
      }, 600);
    }

    // Unlock body scroll
    document.body.classList.add('cover-dismissed');

    // Broadcast: cover dibuka → music.js bisa mulai play
    window.dispatchEvent(new CustomEvent('cover:opened'));
  });
}


/* ─── 7. FRAME POPUP close ──────────────────────────────────────── */
function initFramePopup() {
  const popup = document.getElementById('frame-popup');
  if (!popup) return;

  const closeBtn = document.getElementById('frame-close');
  const overlay = popup.querySelector('.frame-popup__overlay');

  function closeFrame() {
    popup.style.display = 'none';
    const video = popup.querySelector('video');
    if (video) video.pause();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeFrame);
  if (overlay) overlay.addEventListener('click', closeFrame);

  // Buka frame via data attribute (opsional, untuk trigger dari manapun)
  document.querySelectorAll('[data-open-frame]').forEach((btn) => {
    btn.addEventListener('click', () => {
      popup.style.display = '';
      const video = popup.querySelector('video');
      if (video) video.play();
    });
  });
}


/* ─── 8. COUNTDOWN TIMER ───────────────────────────────────────── */
function initCountdown() {
  const timer = document.getElementById('countdown-timer');
  if (!timer) return;

  const targetDate = new Date(timer.dataset.target).getTime();
  if (isNaN(targetDate)) return;

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = timer.querySelector('[data-unit="days"]');
    const hoursEl = timer.querySelector('[data-unit="hours"]');
    const minutesEl = timer.querySelector('[data-unit="minutes"]');
    const secondsEl = timer.querySelector('[data-unit="seconds"]');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (diff <= 0) {
      clearInterval(interval);
    }
  }

  update();
  const interval = setInterval(update, 1000);
}


/* ─── 9. PREVENT SCROLL RESTORATION ──────────────────────────────── */
function preventScrollRestoration() {
  history.scrollRestoration = 'manual';

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
}


/* ─── 10. INIT ALL MODULES ──────────────────────────────────────── */
function initModules() {
  initAnimations();
  initSnapScroll();
  initMusic();
  initRsvp();
  initGift();
}


/* ─── ENTRY POINT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setConfigVariables();
  renderNavButtons();
  updatePreloader();
  handleUrlParams();
  showCoverWhenReady();
  initCoverDismiss();
  initFramePopup();
  initCountdown();
  preventScrollRestoration();
  initModules();
});
