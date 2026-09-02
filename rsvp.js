/* ============================================================
   RSVP.JS — Form submit + comments display
   
   Backend: Google Spreadsheet via Google Apps Script web app
   
   POST (write): Append row ke spreadsheet
   GET  (read): Fetch komentar, filter & reverse
   
   Flow:
   1. initRsvp() — setup form dari config, fetch initial comments
   2. User isi form → klik submit
   3. Validasi → POST ke webhook
   4   Sukses: hide form, show success, re-fetch comments
   5   Gagal: show error notice
   ============================================================ */

import { CONFIG } from './config.js';
import { formatTimeAgo, escapeHtml } from './utils.js';


/* ─── CONSTANTS ─────────────────────────────────────────────── */

/** Attendance values yang menampilkan opsi guest count */
const SHOW_GUEST_COUNT_ON = ['Attend'];

/** Error messages */
const ERROR_MSG = {
  en: 'Please select your attendance',
  id: 'Kehadiran harus diisi',
  empty: 'Please enter your wishes',
  submit_fail: 'Failed to submit form. Please try again.',
};


/* ─── STATE ─────────────────────────────────────────────────── */

/** @type {Array<Object>} All fetched comments */
let allComments = [];

/** @type {number} Current pagination page (1-based) */
let currentPage = 1;


/* ─── INIT ──────────────────────────────────────────────────── */

/**
 * Inisialisasi RSVP system
 * Dipanggil dari app.js saat DOM ready
 */
export function initRsvp() {
  if (!CONFIG.rsvp) return;

  constructForm();
  setupAttendanceChange();
  setupQtyButtons();
  setupFormSubmit();
  fetchAndDisplayComments();
}


/* ─── CONSTRUCT FORM ────────────────────────────────────────────── */

/**
 * Setup form berdasarkan data guest dari URL params
 * - Isi nama guest jika ada
 * - Set max guest count
 * - Tambahkan "(MAX X)" di label guest count
 */
function constructForm() {
  const guestData = document.getElementById('guest-data');
  if (!guestData) return;

  const guestName = guestData.dataset.name;
  const maxGuest = parseInt(guestData.dataset.maxGuest, 10) || 2;
  const nameInput = document.getElementById('field-name');

  // Isi nama guest jika ada
  if (guestName && guestName.trim() !== '') {
    if (nameInput) {
      nameInput.value = guestName;
    }
    // Non-editable jika config mengatakan demikian
    if (!CONFIG.rsvp.isGuestNameEditable && nameInput) {
      nameInput.disabled = true;
    }
  }

  // Set max guest count
  const guestCountInput = document.getElementById('field-guestcount');
  if (guestCountInput) {
    guestCountInput.max = maxGuest;
  }

  // Tambahkan "(MAX X)" di label
  const guestCountLabel = document.querySelector('.rsvp-field__max');
  if (guestCountLabel) {
    guestCountLabel.textContent = ` (MAX ${maxGuest})`;
  }

  // Hide fields yang tidak dipakai (wishes only mode)
  if (CONFIG.rsvp.isWishesOnly) {
    const radioGroup = document.querySelector('.rsvp-field--attendance-radio');
    if (radioGroup) radioGroup.style.display = 'none';
    const guestCountGroup = document.querySelector('.rsvp-field--guestcount');
    if (guestCountGroup) guestCountGroup.style.display = 'none';
  }
}


/* ─── ATTENDANCE CHANGE ─────────────────────────────────────── */

/**
 * Show/hide guest count berdasarkan pilihan attendance
 * "Attend" → tampilkan, lainnya → sembunykan
 * Juga sembunykan error notice jika ada
 */
function setupAttendanceChange() {
  const radios = document.querySelectorAll('input[name="attendance"]');
  
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      onAttendanceChange(radio.value);
    });
  });
}

function onAttendanceChange(value) {
  const guestCountGroup = document.querySelector('.rsvp-field--guestcount');
  if (!guestCountGroup) return;

  const show = SHOW_GUEST_COUNT_ON.includes(value);

  // Show/hide guest count
  guestCountGroup.style.display = show ? '' : 'none';

  // Reset guest count ke 1 jika disembunyikan
  if (!show) {
    const input = document.getElementById('field-guestcount');
    if (input) input.value = 1;
  }

  // Sembunykan error notice
  const errorNotice = document.querySelector('.rsvp-notice--error');
  if (errorNotice) errorNotice.style.display = 'none';
}


/* ─── QTY BUTTONS (+/−) ──────────────────────────────────── */

/**
 * Setup +/- buttons untuk input number (guest count)
 * Clamp antara 1 dan max
 */
function setupQtyButtons() {
  const input = document.getElementById('field-guestcount');
  if (!input) return;

  const minusBtn = input.previousElementSibling;
  const plusBtn = input.nextElementSibling;
  if (!minusBtn || !plusBtn) return;

  minusBtn.addEventListener('click', () => {
    const current = parseInt(input.value, 10) || 1;
    input.value = Math.max(1, current - 1);
  });

  plusBtn.addEventListener('click', () => {
    const current = parseInt(input.value, 10) || 1;
    const max = parseInt(input.max, 10) || 2;
    input.value = Math.min(max, current + 1);
  });
}


/* ─── FORM SUBMIT INTERCEPT ─────────────────────────────────── */

/**
 * Intercepts form submission, validate, dan kirim ke webhook
 * Menggunakan flag `isSubmitting` untuk cegah double-submit
 */
function setupFormSubmit() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  const submitBtn = form.querySelector('.btn-outline');

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitForm();
  });
}

let isSubmitting = false;

function submitForm() {
  if (isSubmitting) return;

  const form = document.getElementById('rsvp-form');
  if (!form) return;

  // Ambil nilai form
  const name = (document.getElementById('field-name') || {}).value || '';
  const wishes = (document.getElementById('field-wishes') || {}).value || '';
  const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
  const attendance = attendanceRadio ? attendanceRadio.value : '';
  const guestCount = (document.getElementById('field-guestcount') || {}).value;
  const phone = ''; // Tidak ada field phone di form kita (disederhan)

  // ─── Validasi ─────────────────────────────────────────

  // 1. Nama wajib diisi
  if (!name.trim()) {
    showError(ERROR_MSG.empty);
    return;
  }

  // 2. Jika bukan wishes-only, cukup cek wishes
  if (CONFIG.rsvp.isWishesOnly) {
    if (!wishes.trim()) {
      showError(ERROR_MSG.empty);
      return;
    }
  } else {
    // 3. Attendance wajib dipilih
    if (!attendance || attendance === '0') {
      showError(ERROR_MSG);
      return;
    }
  }

  // ── Kirim data body ───────────────────────────────────────

  let body = {};

  if (CONFIG.rsvp.isWishesOnly) {
    body = {
      code: getGuestCode(),
      name: name.trim(),
      text: wishes.trim(),
    };
  } else {
    body = {
      code: getGuestCode(),
      name: name.trim(),
      text: wishes.trim(),
      status: attendance,
      phone: phone,
    };

    // Guest count — hanya kirim jika "Attend"
    if (guestCount !== null && SHOW_GUEST_COUNT_ON.includes(attendance)) {
      body.guest_count = parseInt(guestCount, 10);
      body.is_attending = true;
    } else {
      body.is_attending = false;
    }
  }

  // ── Kirim ke webhook ────────────────────────────────────

  isSubmitting = true;

  const webhookUrl = CONFIG.rsvp.webhookUrl;

  if (!webhookUrl) {
    // Webhook belum dikonfigurasi
    showError(ERROR_MSG.submit_fail);
    isSubmitting = false;
    return;
  }

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'render' },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log('RSVP submitted:', data);

      if (data.success !== true) {
        throw new Error(data.error || 'Unknown error');
      }

      // Sukses — tampilkan success, sembunyikan form
      hideForm();
      showSuccess();
      fetchAndDisplayComments();
    })
    .catch((error) => {
      console.error('RSVP submit error:', error);
      showError(ERROR_MSG.submit_fail);
    })
    .finally(() => {
      isSubmitting = false;
    });
}


/* ─── FORM SHOW/HIDE ─────────────────────────────────────── */

function hideForm() {
  const form = document.getElementById('rsvp-form');
  if (form) form.style.display = 'none';
}

function showSuccess() {
  const form = document.getElementById('rsvp-form');
  const successNotice = document.querySelector('.rsvp-notice--success');
  if (!form || !successNotice) return;

  // Render success message dengan checkmark SVG
  const checkSvg = '<svg width="14" height="11" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="' + getConfirmationColor() + '"><path d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0-.884-4.149z"/></svg>';

  const message = CONFIG.rsvp.language === 'id'
    ? '&nbsp;Terima kasih, respon anda sudah diterima!'
    : '&nbsp;Thank you, we have received your response!';

  successNotice.innerHTML = checkSvg + message;
  successNotice.style.color = getConfirmationColor();
  successNotice.style.display = 'block';
}

function getConfirmationColor() {
  // Warna teks konfirmasi — putih putih sesuai tema gelap
  return '#FFFFFF';
}


/* ─── ERROR NOTICE ─────────────────────────────────────────── */

function showError(msg) {
  const errorNotice = document.querySelector('.rsvp-notice--error');
  if (!errorNotice) return;

  errorNotice.textContent = msg;
  errorNotice.style.display = 'block';
}


/* ─── FETCH COMMENTS ─────────────────────────────────────────── */

/**
 * Fetch komentar dari spreadsheet via GET endpoint
 * Filter hanya yang punya text, reverse (newest first),
 * render dengan pagination
 */
function fetchAndDisplayComments() {
  const container = document.getElementById('rsvp-comments');
  const pagination = document.getElementById('rsvp-pagination');
  if (!container) return;

  const webhookUrl = CONFIG.rsvp.webhookUrl;

  if (!webhookUrl) {
    showEmptyState();
    return;
  }

  const sheetName = CONFIG.rsvp.sheetName || 'Responses';
  const url = `${webhookUrl}?sheetName=${encodeURIComponent(sheetName)}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      // Filter: hanya yang punya teks non-kosong
      allComments = (data.data || [])
        .filter((comment) => comment.text && comment.text.trim() !== '')
        .reverse(); // Newest first

      if (allComments.length > 0) {
        container.style.display = 'block';
        currentPage = 1;
        renderCommentsPage();
      } else {
        showEmptyState();
      }
    })
    .catch((error) => {
      console.error('Fetch comments error:', error);
      // Jika belum ada komentar, tampilkan empty state
      if (!container.querySelector('.rsvp-comment')) {
        showEmptyState();
      }
    });
}


/* ─── RENDER COMMENTS ─────────────────────────────────────────── */

/**
 * Render halaman komentar saat ini dari allComments array
 * Setiap halaman berisi N item (dari config.rsvp.itemsPerPage)
 */
function renderCommentsPage() {
  const container = document.getElementById('rsvp-comments');
  if (!container) return;

  // Clear container
  container.innerHTML = '';

  const totalPages = Math.ceil(allComments.length / CONFIG.rsvp.itemsPerPage);
  const start = (currentPage - 1) * CONFIG.rsvp.itemsPerPage;
  const pageComments = allComments.slice(start, start + CONFIG.rsvp.itemsPerPage);

  // Render setiap komentar
  pageComments.forEach((comment) => {
    const div = document.createElement('div');
    div.className = 'rsvp-comment';
    div.innerHTML = `
      <span class="rsvp-comment__name">${escapeHtml(comment.name)}</span>
      <span class="rsvp-comment__text">${escapeHtml(comment.text)}</span>
      <span class="rsvp-comment__time">${formatTimeAgo(comment.created_at, CONFIG.rsvp.language)}</span>
    `;
    container.appendChild(div);
  });

  // Render pagination controls
  renderPagination(totalPages);
}


/* ─── PAGINATION ─────────────────────────────────────────── */

/**
 * Render prev/next buttons dan info "1 / N"
 * Sembunykan jika hanya 1 halaman
 */
function renderPagination(totalPages) {
  let pagination = document.getElementById('rsvp-pagination');
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'rsvp-pagination';
    container.after(pagination);
  }

  // Clear
  pagination.innerHTML = '';

  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }

  pagination.style.display = 'flex';

  const prevLabel = CONFIG.rsvp.language === 'id' ? '‹ Sebelumnya' : '‹ Prev';
  const nextLabel = CONFIG.rsvp.language === 'id' ? 'Berikutnya ›' : 'Next ›';
  const pageInfo = `${currentPage} / ${totalPages}`;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'rsvp-page-btn rsvp-prev-btn';
  prevBtn.innerHTML = prevLabel;
  prevBtn.disabled = currentPage === 1;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'rsvp-page-btn rsvp-next-btn';
  nextBtn.innerHTML = nextLabel;
  nextBtn.disabled = currentPage === totalPages;

  const pageInfo = document.createElement('span');
  pageInfo.className = 'rsvp-page-info';
  pageInfo.textContent = pageInfo;

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);

  // Prev/Next click handlers
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderCommentsPage();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCommentsPage();
    }
  });
}


/* ─── EMPTY STATE ─────────────────────────────────────────────── */

/**
 * Tampilkan pesan "Wishes will be shown here" saat belum ada komentar
 */
function showEmptyState() {
  const container = document.getElementById('rsvp-comments');
  const pagination = document.getElementById('rsvp-pagination');

  if (container) {
    const emptyMsg = CONFIG.rsvp.language === 'id'
      ? 'Ucapan akan ditampilkan di sini'
      : 'Wishes will be shown here';

    container.innerHTML = `<div class="rsvp-empty">${emptyMsg}</div>`;
    container.style.display = 'block';
  }

  if (pagination) {
    pagination.style.display = 'none';
  }
}


/* ─── HELPERS ─────────────────────────────────────────────── */

/**
 * Ambil guest code dari URL params (?code=xxx)
 * Digunakan saat submit RSVP untuk identifikasi tamu
 */
function getGuestCode() {
  const guestData = document.getElementById('guest-data');
  return guestData ? (guestData.dataset.code || '') : '';
}
