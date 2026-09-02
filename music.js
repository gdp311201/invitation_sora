/* ============================================================
   MUSIC.JS — MP3 player sederhana
   
   Flow:
   1. Set audio src dari config saat init
   2. Dengar event 'cover:opened' dari app.js → mulai musik
   3. Toggle play/pause via music button
   4. Pause saat tab hidden, resume saat visible (jika sedang play)
   
   Tidak ada YouTube — cukup MP3 langsung dari jsDelivr CDN.
   Autoplay aman karena dipicu dari user click (OPEN INVITATION).
   ============================================================ */

import { CONFIG } from './config.js';

/** @type {HTMLAudioElement|null} */
let audio;

/** @type {boolean} */
let isPlaying = false;


/**
 * Inisialisasi music player
 * Dipanggil dari app.js saat DOM ready
 */
export function initMusic() {
  // Cek apakah ada URL musik di config
  if (!CONFIG.music?.url) return;

  // Ambil referensi audio element
  audio = document.getElementById('mp3-player');
  if (!audio) return;

  // Set source
  audio.src = CONFIG.music.url;

  // Loop sesuai config (override HTML attribute)
  audio.loop = CONFIG.music.loop !== false;

  // ─── Event listeners ───────────────────────────────────────

  // 1. Mulai musik saat cover dibuka (dari app.js)
  window.addEventListener('cover:opened', playMusic);

  // 2. Toggle play/pause saat button diklik
  const btn = document.getElementById('music-button');
  if (btn) {
    btn.addEventListener('click', toggleMusic);
  }

  // 3. Pause/resume saat tab switch
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 4. Tampilkan button saat audio siap diputar
  audio.addEventListener('canplaythrough', showMusicButton);
  audio.addEventListener('canplay', showMusicButton);

  // 5. Sembunyikan button jika audio gagal load
  audio.addEventListener('error', hideMusicButton);
}


/* ─── SHOW/HIDE MUSIC BUTTON ─────────────────────────────────── */

function showMusicButton() {
  const btn = document.getElementById('music-button');
  if (btn) btn.classList.add('visible');
}

function hideMusicButton() {
  const btn = document.getElementById('music-button');
  if (btn) btn.classList.remove('visible');
}


/* ─── PLAY ──────────────────────────────────────────────────── */

/**
 * Mulai musik. Dipanggil saat cover dibuka.
 * Menggunakan play() Promise untuk handle autoplay blocking.
 */
function playMusic() {
  if (!audio) return;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    // Browser modern — handle promise
    playPromise
      .then(() => {
        isPlaying = true;
        updateButtonState();
      })
      .catch((err) => {
        // Autoplay diblokir — user belum interaksi browser
        // Ini normal, tidak perlu tampilkan error
        console.log('Music autoplay blocked:', err.message);
      });
  } else {
    // Fallback browser lama
    isPlaying = true;
    updateButtonState();
  }
}


/* ─── TOGGLE ──────────────────────────────────────────────── */

/**
 * Toggle play/pause. Dipanggil saat music button diklik.
 */
function toggleMusic() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    playMusic();
  }

  updateButtonState();
}


/* ─── BUTTON STATE ─────────────────────────────────────────── */

/**
 * Update class 'paused' pada button berdasarkan state isPlaying.
 * CSS handle icon swap:
 *   .paused     → tampilkan icon play note
 *   tidak paused → tampilkan icon pause bars + pulse animasi
 */
function updateButtonState() {
  const btn = document.getElementById('music-button');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.remove('paused');
  } else {
    btn.classList.add('paused');
  }
}


/* ─── VISIBILITY CHANGE ─────────────────────────────────────── */

/**
 * Pause saat tab hidden, resume saat tab visible.
 * Hanya resume jika musik sedang diputar sebelumnya
 * (menghindari auto-play di background tab).
 */
function handleVisibilityChange() {
  if (!audio) return;

  if (document.hidden) {
    // Tab hidden → selalu pause
    audio.pause();
    isPlaying = false;
    updateButtonState();

  } else {
    // Tab visible → resume HANYA JIKA sedang diputar
    if (isPlaying) {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            updateButtonState();
          })
          .catch(() => {
            // Resume gagal (autoplay blocked) — update state
            isPlaying = false;
            updateButtonState();
          });
      } else {
        audio.play();
        isPlaying = true;
        updateButtonState();
      }
    }
  }
}
