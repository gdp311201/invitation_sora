/* ============================================================
   MUSIC.JS — MP3 player sederhana (Fixed Selector Alignment)
   ============================================================ */

import { CONFIG } from './config.js';

let audio;
let isPlaying = false;

export function initMusic() {
  const musicUrl = CONFIG.music?.url || CONFIG.MUSIC_URL;
  if (!musicUrl) return;

  audio = document.getElementById('mp3-player');
  if (!audio) {
    audio = new Audio();
    audio.id = 'mp3-player';
    document.body.appendChild(audio);
  }

  audio.src = musicUrl;
  audio.loop = CONFIG.music?.loop !== false;

  // 1. Dengarkan Event Cover Opened
  window.addEventListener('cover:opened', playMusic);

  // 2. Event Listener Tombol Musik (Mendukung #music-button & #music-toggle)
  const btn = document.getElementById('music-button') || document.getElementById('music-toggle');
  if (btn) {
    btn.addEventListener('click', toggleMusic);
  }

  // 3. Tab Visibility Handler
  document.addEventListener('visibilitychange', handleVisibilityChange);

  audio.addEventListener('canplaythrough', showMusicButton);
  audio.addEventListener('canplay', showMusicButton);
  audio.addEventListener('error', hideMusicButton);
}

function showMusicButton() {
  const btn = document.getElementById('music-button') || document.getElementById('music-toggle');
  if (btn) {
    btn.classList.remove('hidden');
    btn.classList.add('visible');
  }
}

function hideMusicButton() {
  const btn = document.getElementById('music-button') || document.getElementById('music-toggle');
  if (btn) btn.classList.add('hidden');
}

export function playMusic() {
  if (!audio) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        updateButtonState();
      })
      .catch((err) => {
        console.log('Autoplay blocked:', err.message);
      });
  } else {
    isPlaying = true;
    updateButtonState();
  }
}

export function toggleMusic() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    playMusic();
  }
  updateButtonState();
}

function updateButtonState() {
  const btn = document.getElementById('music-button') || document.getElementById('music-toggle');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.remove('paused');
  } else {
    btn.classList.add('paused');
  }
}

function handleVisibilityChange() {
  if (!audio) return;

  if (document.hidden) {
    audio.pause();
    isPlaying = false;
    updateButtonState();
  } else if (isPlaying) {
    playMusic();
  }
}
