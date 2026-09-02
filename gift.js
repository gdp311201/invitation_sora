/* ============================================================
   GIFT.JS — Expand/collapse gift section
   
   Semua animasi expand/collapse ada di CSS (components.css).
   JS hanya handle:
   1. Toggle active class pada container
   2. Copy text ke clipboard
   3. Open link di tab baru (gift registry)
   
   CSS melakukan:
   - width 140px → 100% (transition 0.65s ease-in-out, no delay)
   - background transparent → black-28 + blur 12px (transition 0.5s ease-in-out, no delay)
   - button opacity 1 → 0 (transition 0.95s ease)
   - close button opacity 0 → 1 (transition 0.95s ease)
   - wrapper grid-rows 0fr → 1fr (transition 0.65s ease-in-out 0.4s)
   - item opacity 0 → 1 (stagger delay per item, 0.1s increment)
   - divider opacity 0 → 0.2 (stagger delay per divider, 0.1s increment)
   ============================================================ */

import { copyText } from './utils.js';


/**
 * Inisialisasi gift section
 * Dipanggil dari app.js saat DOM ready
 */
export function initGift() {
  const container = document.getElementById('gift-container');
  if (!container) return;

  // ─── OPEN BUTTON ───────────────────────────────────────
  const openBtn = document.getElementById('gift-open');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      container.classList.toggle('active');
    });
  }

  // ─── CLOSE BUTTON ──────────────────────────────────────
  const closeBtn = document.getElementById('gift-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  }

  // ─── COPY & LINK BUTTONS ────────────────────────────
  // Dua tipe button, beda class yang sama (.gift-copy)
  document.querySelectorAll('.gift-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Copy button — salin teks ke clipboard
      if (btn.dataset.copy) {
        copyText(btn.dataset.copy);
      }
      // Link button — buka URL di tab baru
      if (btn.dataset.href) {
        window.open(btn.dataset.href, '_blank');
      }
    });
  });
}
