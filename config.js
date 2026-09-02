// ============================================================
// CONFIG.JS — Semua data undangan ada di sini
// Edit file ini saja untuk ganti konten, tidak perlu sentuh HTML/JS lain
// ============================================================

export const CONFIG = {

  // ─── MEMPELAI ───────────────────────────────────────────────
  couple: {
    groom: {
      shortName: "Samuel",
      fullName: "Samuel Jovan Hartanto",
      parent: "Mr. Samuel's Father &<br>Mrs. Samuel's Mother",
      instagram: "sam.hartanto",
      instagramUrl: "https://instagram.com/sam.hartanto",
    },
    bride: {
      shortName: "Evelyn",
      fullName: "Evelyn Naomi Anastasia",
      parent: "Mr. Evelyn's Father &<br>Mrs. Evelyn's Mother",
      instagram: "evelynna",
      instagramUrl: "https://instagram.com/evelynna",
    },
    hashtag: "#SAMeoneforEVELYN",
  },

  // ─── ACARA ──────────────────────────────────────────────────
  event: {
    day: "Saturday",
    date: "20 June 2026",
    dateFormatted: "Saturday, 20 June 2026",
    dateShort: "20 / 06 / 2026",

    // Countdown target (ISO 8601)
    countdownTarget: "2026-06-20T09:30:00+07:00",

    // Google Calendar link
    calendarUrl: "https://www.google.com/calendar/render?action=TEMPLATE"
      + "&text=The%20Wedding%20of%20Samuel%20%26%20Evelyn"
      + "&details&dates=20260620/20260620&location",

    sessions: [
      {
        name: "Holy Matrimony",
        time: "09.30 - 11.00 WIB",
        venue: "The Hermitage Hotel Jakarta",
        address: "Jl. Cilacap No.1, Menteng, Kota Jakarta Pusat, DKI Jakarta 10310",
        mapsUrl: "https://maps.app.goo.gl/5XJrVf3zcwFKg3A58",
      },
      {
        name: "Tea Pai",
        time: "15.30 - 17.00 WIB",
        venue: "Pullman Jakarta Indonesia Thamrin",
        address: "Jl. M.H. Thamrin No.59, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10350",
        mapsUrl: "https://maps.app.goo.gl/5TpUR4aBvBud16cB8",
      },
      {
        name: "Reception",
        time: "19.00 - 20.00 WIB",
        // Waktu sesi 2 (aktif jika URL ada ?s=2)
        timeSession2: "20.00 - 21.00 WIB",
        venue: "Pullman Jakarta Indonesia Thamrin",
        address: "Jl. M.H. Thamrin No.59, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10350",
        mapsUrl: "https://maps.app.goo.gl/5XJrVf3zcwFKg3A58",
      },
    ],
  },

  // ─── AYAT ALKITAB ───────────────────────────────────────────
  verse: {
    reference: "Mark 10:6-9",
    text: "\u201CBut at the beginning of creation God \u2018made them male and female.\u2019 "
      + "\u2018For this reason a man will leave his father and mother and be united to his wife, "
      + "and the two will become one flesh.\u2019 So they are no longer two, but one flesh. "
      + "Therefore what God has joined together, let no one separate.\u201D",
  },

  // ─── CERITA CINTA ───────────────────────────────────────────
  loveStory: {
    title: "The Path Where Two Hearts Unite",
    chapters: [
      {
        title: "The Beginning",
        text: "Our story began like a quiet song\u2014unexpected yet comforting. "
          + "We met at just the right time, when life was still figuring itself out. "
          + "What started as casual conversations turned into deep connections, "
          + "shared dreams, and a sense of home in each other\u2019s presence.",
      },
      {
        title: "Growing Love",
        text: "As time passed, we grew not just as individuals, but as a team. "
          + "We've celebrated wins, braved challenges, and found countless reasons "
          + "to laugh along the way.",
      },
      {
        title: "A Promise for Forever",
        text: "Now, with joyful hearts and hopeful eyes, we\u2019re stepping into the next chapter. "
          + "This wedding isn\u2019t just a celebration of a day\u2014it\u2019s a celebration of a journey, "
          + "a promise, and the love we\u2019re lucky enough to call our own.",
      },
    ],
  },

  // ─── DRESSCODE ──────────────────────────────────────────────
  dresscode: {
    colors: ["#F1C193", "#D4A574", "#C8956E", "#B8860B", "#8B7355"],
    description: "We kindly encourage our guests to wear tones from our selected color palette.",
  },

  // ─── LIVESTREAMING ──────────────────────────────────────────
  livestream: {
    date: "Saturday, 11 April 2026",
    time: "11:00 - 13:00 WIB",
    url: "https://instagram.com/envelope.id",
  },

  // ─── WEDDING FRAME ──────────────────────────────────────────
  frame: {
    instagramUrl: "https://instagram.com/envelope.id",
    videoUrl: "https://s3.envelope.id/wp/uploads/2026/03/highlight-swipe.mp4",
  },

  // ─── GIFT / AMAL ────────────────────────────────────────────
  gift: {
    message: "The greatest gift is having you with us. If you\u2019d like to give "
      + "a token of love, we would be truly grateful.",
    accounts: [
      {
        bank: "BCA",
        name: "Samuel Jovan Hartono",
        number: "123456789",
      },
      {
        bank: "Mandiri",
        name: "Evelyn Naomi Anastasia",
        number: "987654321",
      },
    ],
    physicalGift: {
      name: "Evelyn",
      phone: "08123456789",
      address: "Jl. Arcadia Raya No.9, Bandung 40288",
    },
    giftRegistryUrl: "https://instagram.com/envelope.id",
  },

  // ─── RSVP ───────────────────────────────────────────────────
  rsvp: {
    // Google Apps Script Webhook URL (akan diisi setelah setup)
    webhookUrl: "",
    // Google Spreadsheet ID untuk fetch comments (akan diisi setelah setup)
    spreadsheetId: "",
    // Sheet name
    sheetName: "Responses",
    maxGuest: 2,
    language: "en",
    isWishesOnly: false,
    isGuestNameEditable: false,
    itemsPerPage: 4,
  },

  // ─── MUSIK ──────────────────────────────────────────────────
  music: {
    url: "https://cdn.jsdelivr.net/gh/gdp311201/invitation_sora@main/backsound.mp3",
    loop: true,
  },

  // ─── GAMBAR ─────────────────────────────────────────────────
  // ⚠️ Saat ini hotlink dari CDN Sora — ganti ke repo lu sendiri untuk production
  images: {
    hero: "https://s3.envelope.id/wp/uploads/2026/03/stock2_43_1774793377.jpg",
    arrow: "https://s3.envelope.id/wp/uploads/2026/02/arrow-white-light.webp",
    rundown: "https://s3.envelope.id/wp/uploads/2026/04/1615_rundown.png",
    logo: "https://s3.envelope.id/content/brand/envelope-horizontal-white-sm.webp",
    // Icon SVGs
    copyIcon: "https://s3.envelope.id/wp/uploads/2026/02/copy-white.svg",
    arrowIcon: "https://s3.envelope.id/wp/uploads/2026/02/right-arrow-icon-white.svg",
    giftIcon: "https://s3.envelope.id/wp/uploads/2026/02/gift-icon-white.svg",
    closeIcon: "https://s3.envelope.id/wp/uploads/2026/02/cross-svgrepo-com-1.svg",
    // Bank logos
    bankBCA: "https://wp.envelope.id/wp-content/uploads/2024/02/bca.png",
    bankMandiri: "https://wp.envelope.id/wp-content/uploads/2024/02/mandiri.png",
  },

  // ─── NAVIGASI (panel kiri desktop) ──────────────────────────
  nav: {
    items: [
      { label: "Opening",  target: "#opening" },
      { label: "Couple",   target: "#couple" },
      { label: "Story",    target: "#lovestory" },
      { label: "Events",   target: "#events" },
      { label: "RSVP",     target: "#rsvp" },
      { label: "Gift",     target: "#gift" },
      { label: "Closing",  target: "#closing" },
    ],
  },

  // ─── CLOSING ────────────────────────────────────────────────
  closing: {
    title: "Thank You for Your Presence & Blessings",
    message: "We can\u2019t wait to share this special moment with you.<br>"
      + "Your presence will make our day even more meaningful.",
  },

  // ─── BRANDING ───────────────────────────────────────────────
  brand: {
    name: "\u00e9nvelope",
    logoUrl: "https://s3.envelope.id/content/brand/envelope-horizontal-white-sm.webp",
    url: "https://instagram.com/envelope.id",
    year: 2026,
  },
};
