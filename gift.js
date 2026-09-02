/**
 * js/gift.js
 * Modul untuk menangani modal Amplop Digital / Hadiah (Rekening, E-Wallet, & Alamat Kirim)
 */

import { CONFIG } from './config.js';

export function initGift() {
    const giftBtn = document.getElementById('giftBtn') || document.querySelector('.btn-gift');
    const giftModal = document.getElementById('giftModal');
    const closeModalBtns = document.querySelectorAll('[data-close-modal="gift"], .gift-close');

    // 1. Inisialisasi Modal Open / Close
    if (giftBtn && giftModal) {
        giftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            giftModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Kunci scroll saat modal terbuka
        });
    }

    if (closeModalBtns.length > 0) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (giftModal) giftModal.classList.remove('active');
                document.body.style.overflow = ''; // Kembalikan scroll
            });
        });
    }

    // Tutup modal jika user mengklik diluar area konten modal (backdrop)
    if (giftModal) {
        giftModal.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                giftModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Handler Copy to Clipboard (Nomor Rekening / Alamat)
    const copyButtons = document.querySelectorAll('.btn-copy-account, [data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const textToCopy = this.getAttribute('data-copy') || this.dataset.accountNumber;
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showCopyFeedback(this, 'Berhasil Disalin!');
            } catch (err) {
                // Fallback untuk browser / webview yang tidak mendukung navigator.clipboard
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopyFeedback(this, 'Berhasil Disalin!');
            }
        });
    });

    // 3. Handler Konfirmasi Hadiah via WhatsApp (Opsional)
    const confirmWaBtn = document.getElementById('confirmGiftWa');
    if (confirmWaBtn) {
        confirmWaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Pembacaan konfigurasi disesuaikan dengan struktur CONFIG di config.js
            const phone = CONFIG.gift?.physicalGift?.phone || '6281234567890';
            const groomName = CONFIG.couple?.groom?.shortName || 'Mempelai Pria';
            const brideName = CONFIG.couple?.bride?.shortName || 'Mempelai Wanita';
            
            const message = `Halo ${groomName} & ${brideName}, saya telah mengirimkan kado/amplop digital untuk pernikahan kalian. Selamat atas pernikahan kalian!`;
            const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            
            window.open(waUrl, '_blank');
        });
    }
}

/**
 * Helper visual feedback saat teks berhasil disalin
 */
function showCopyFeedback(buttonElement, message) {
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
    buttonElement.classList.add('copied');
    buttonElement.disabled = true;

    setTimeout(() => {
        buttonElement.innerHTML = originalText;
        buttonElement.classList.remove('copied');
        buttonElement.disabled = false;
    }, 2000);
}
