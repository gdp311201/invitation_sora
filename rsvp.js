import { CONFIG } from './config.js';
import { formatTimeAgo, escapeHtml } from './utils.js';

export function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const feed = document.getElementById('wishes-feed');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-submit-rsvp');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      status: formData.get('status'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    try {
      // Simulasi POST request (dapat disesuaikan dengan webhook/backend kamu)
      console.log('Sending RSVP:', data);
      alert('Terima kasih atas ucapan & konfirmasi Anda!');
      form.reset();
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
