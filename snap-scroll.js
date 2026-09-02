/* ============================================================
   SNAP-SCROLL.JS — Scroll snap management
   
   Tanggung jawab untuk:
   1. Smooth scroll untuk anchor link (nav buttons → #section)
   2. Safari fix: scroll-snap + smooth scroll konflik
   3. No-snap class saat input focus (mobile keyboard)
   ============================================================ */

/**
 * Inisialisasi snap scroll behavior
 * Dipanggil dari app.js saat DOM ready
 */
export function initSnapScroll() {
  initAnchorScroll();
  initNoSnapOnFocus();
}

/* ─── ANCHOR SCROLL — nav buttons ──────────────────────────── */
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isSafari) {
        // Safari tidak bisa smooth scroll saat snap aktif
        // Solusi: matikan snap dulu, scroll, nyalakan lagi
        document.documentElement.style.scrollSnapType = 'none';

        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });

        setTimeout(() => {
          document.documentElement.style.scrollSnapType = 'y mandatory';
        }, 1000);
      } else {
        // Browser lain: smooth scroll langsung, snap handle snap-point
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ─── NO-SNAP ON FOCUS — mobile keyboard fix ─────────────────── */
/* 
   Masalah: Saat user tap input di mobile, keyboard muncul dan
   browser berusaha scroll ke input tersebut. Scroll snap
   mengganggu ini — browser snap ke section, bukan ke input.
   
   Solusi: Saat input/textarea/select focus, tambah class 'no-snap'
   ke <html> yang mematikan scroll-snap-type: none.
   Saat blur, hapus class setelah delay 100ms.
   
   Delay 100ms penting agar saat pindah antar input (focusout lalu
   focusin), tidak ada flicker snap on/off.
*/
function initNoSnapOnFocus() {
  let focusTimeout;

  document.addEventListener('focusin', (e) => {
    if (!e.target.matches('input, textarea, select')) return;

    clearTimeout(focusTimeout);
    document.documentElement.classList.add('no-snap');
  });

  document.addEventListener('focusout', (e) => {
    if (!e.target.matches('input, textarea, select')) return;

    focusTimeout = setTimeout(() => {
      document.documentElement.classList.remove('no-snap');
    }, 100);
  });
}
