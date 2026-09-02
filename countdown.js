/**
 * js/countdown.js
 * Modul Hitung Mundur Waktu Acara Pernikahan (Days, Hours, Minutes, Seconds)
 */

import { INVITATION_CONFIG } from './config.js';

let countdownInterval = null;

export function initCountdown() {
    // Ambil target tanggal dari config, atau gunakan default jika tidak diset
    const targetDateStr = INVITATION_CONFIG.eventDate || '2026-12-31T08:00:00+07:00';
    const targetTime = new Date(targetDateStr).getTime();

    // Elemen DOM penampung nilai hitung mundur
    const daysEl = document.getElementById('days') || document.querySelector('.countdown-days');
    const hoursEl = document.getElementById('hours') || document.querySelector('.countdown-hours');
    const minutesEl = document.getElementById('minutes') || document.querySelector('.countdown-minutes');
    const secondsEl = document.getElementById('seconds') || document.querySelector('.countdown-seconds');
    const countdownContainer = document.getElementById('countdown') || document.querySelector('.countdown-wrapper');

    if (!daysEl && !hoursEl && !minutesEl && !secondsEl) {
        console.warn('Countdown elements not found in DOM.');
        return;
    }

    // Bersihkan interval sebelumnya jika fungsi dipanggil ulang
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdownContainer) {
                countdownContainer.innerHTML = `<div class="event-started-msg">Acara Sedang / Telah Berlangsung</div>`;
            } else {
                if (daysEl) daysEl.textContent = '00';
                if (hoursEl) hoursEl.textContent = '00';
                if (minutesEl) minutesEl.textContent = '00';
                if (secondsEl) secondsEl.textContent = '00';
            }
            return;
        }

        // Kalkulasi Waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Render ke DOM dengan format 2 digit (misal: 09)
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Jalankan kalkulasi pertama kali agar tidak ada delay 1 detik saat render
    updateCountdown();

    // Set interval 1 detik (1000ms)
    countdownInterval = setInterval(updateCountdown, 1000);
}
