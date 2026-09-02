/* ============================================================
   ANIMATIONS.JS — IntersectionObserver-based reanimate system
   
   Cara kerja:
   1. Cari semua elemen dengan class .animate
   2. Untuk setiap elemen, buat IntersectionObserver
   3. Saat elemen masuk viewport → tambah .is-visible
   4. Saat elemen keluar viewport → hapus .is-visible
   5. CSS handle transisi dari state "hidden" ke "visible"
   
   Opsional: override rootMargin via data attribute
     <div class="animate animate--fade" data-io-top="-50px" data-io-bottom="0px">
   ============================================================ */

/**
 * Inisialisasi observer untuk semua elemen .animate
 * Dipanggil dari app.js saat DOM ready
 */
export function initAnimations() {
  const elements = document.querySelectorAll('.animate');

  elements.forEach((el) => {
    // Baca custom root margin dari data attributes (opsional)
    const top = el.dataset.ioTop || '-10px';
    const bottom = el.dataset.ioBottom || '-10px';
    const rootMargin = `${top} 0px ${bottom} 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0.01, // Trigger saat minimal 1% terlihat
      }
    );

    observer.observe(el);
  });
}
