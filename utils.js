/* ============================================================
   UTILS.JS — Helper functions bersifat, zero dependency
   Digunakan oleh rsvp.js dan modul lain
   ============================================================ */


/**
 * Salin teks ke clipboard
 * Digunakan oleh gift section (copy nomor rekening, alamat)
 */
export function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  }
}


/**
 * Format waktu relatif — "5 minutes 23 seconds ago"
 * Digunakan oleh RSVP comments list
 * 
 * @param {string} datetimeString — ISO 8601 string
 * @param {string} language — "en" atau "id"
 * @returns {string}Formatted relative time string
 */
export function formatTimeAgo(datetimeString, language = 'en') {
  const now = new Date();
  const targetDate = new Date(datetimeString);
  const diff = now - targetDate;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Labels
  const labels = language === 'id'
    ? { seconds: 'detik lalu', hours: 'jam lalu', minutes: 'menit', days: 'hari' }
    : { seconds: 'seconds ago', hours: 'hours ago', minutes: 'minutes', days: 'days' };

  if (seconds < 60) {
    return `${seconds} ${labels.seconds}`;
  } else if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return `${minutes} ${labels.minutes} ${remainingSeconds} ${labels.seconds}`;
  } else {
    const remainingHours = hours % 24;
    return `${days} ${labels.days} ${remainingHours} ${labels.hours}`;
  }
}


/**
 * Escape HTML entities — mencegah XSS
 * Digunakan saat render user-generated content (RSVP comments)
 * 
 * @param {string} str — Raw text dari user
 * @returns {string} Safe HTML string
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
