let currentDate = new Date();
const realToday = new Date();
realToday.setHours(0, 0, 0, 0);

let calendarEvents = [];
let resetTimer = null;
let monthCache = {}; // 🔥 cache data per bulan

const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// ===============================
// FORMAT DATE
// ===============================
function formatDate(year, monthIndex, day) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

// ===============================
// FETCH DATA PER BULAN
// ===============================
function fetchMonthData(dateObj) {
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const key = `${month}-${year}`;

    // 🔥 kalau sudah ada di cache, pakai itu
    if (monthCache[key]) {
        calendarEvents = monthCache[key];
        renderCalendar();
        return;
    }

    fetch(`/calendar/import?bulan=${key}`)
        .then(res => res.json())
        .then(data => {
            monthCache[key] = data; // simpan cache
            calendarEvents = data;
            renderCalendar();
        })
        .catch(err => console.error('Fetch month error:', err));
}

// ===============================
// TIMER AUTO RESET (20 DETIK)
// ===============================
function startResetTimer() {
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        currentDate = new Date();
        fetchMonthData(currentDate);
    }, 60000);
}

// ===============================
// RENDER KALENDER
// ===============================
function renderCalendar() {

    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("monthYear");
    const btn = document.getElementById("btnTodayDisplay");

    grid.innerHTML = "";

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    title.innerText = `${monthNames[month]} ${year}`;
    btn.innerText = monthNames[month];

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    // ===============================
    // TANGGAL BULAN SEBELUMNYA
    // ===============================
    for (let i = firstDay; i > 0; i--) {
        grid.innerHTML += `<div class="cell muted"><div class="date-box">${prevDays - i + 1}</div></div>`;
    }

    const todayIndex = Math.floor((firstDay + realToday.getDate() - 1) / 7);

    // ===============================
    // TANGGAL BULAN SEKARANG
    // ===============================
    for (let d = 1; d <= daysInMonth; d++) {

        const date = new Date(year, month, d);
        date.setHours(0, 0, 0, 0);

        const isToday = date.getTime() === realToday.getTime();

        const cellIndex = grid.children.length;
        const rowIndex = Math.floor(cellIndex / 7);

        const isSameWeek =
            date.getMonth() === realToday.getMonth() &&
            date.getFullYear() === realToday.getFullYear() &&
            rowIndex === todayIndex;

        const dateKey = formatDate(year, month, d);

        const hasEvent = calendarEvents.some(e =>
            e.start && e.start.startsWith(dateKey)
        );

        const badgeHTML = hasEvent
            ? `<div class="badge-wrapper"><div class="badge">...</div></div>`
            : '';

        grid.innerHTML += `
            <div class="cell
                ${isToday ? 'active' : ''}
                ${isSameWeek ? 'week-active' : ''}"
                onclick="showAgendaWithReset(${d},'${monthNames[month]}',${year},this)">
                
                <div class="date-container">
                    <div class="date-box">${d}</div>
                    ${badgeHTML}
                </div>
            </div>
        `;
    }

    // ===============================
    // TANGGAL BULAN BERIKUTNYA
    // ===============================
    let nextDay = 1;
    while (grid.children.length < 42) {
        grid.innerHTML += `<div class="cell muted"><div class="date-box">${nextDay}</div></div>`;
        nextDay++;
    }

    const active = document.querySelector(".cell.active");
    if (active) {
        showAgenda(realToday.getDate(), monthNames[month], year, active);
    }
}

// ===============================
// KLIK TANGGAL
// ===============================
function showAgendaWithReset(day, monthName, year, el) {
    showAgenda(day, monthName, year, el);
    startResetTimer();
}

function showAgenda(day, monthName, year, el) {

    document.querySelectorAll(".cell").forEach(c =>
        c.classList.remove("active")
    );
    el.classList.add("active");

    document.getElementById("agendaTitle").innerText =
        `Agenda - ${day} ${monthName} ${year}`;

    const content = document.getElementById("agendaContent");
    const monthIndex = monthNames.indexOf(monthName);
    const dateKey = formatDate(year, monthIndex, day);

    const agendas = calendarEvents.filter(e =>
        e.start && e.start.startsWith(dateKey)
    );

    if (agendas.length === 0) {
        content.innerHTML = `
        <div class="no-agenda-card">
            <div class="icon-wrapper">
                <!-- Lingkaran bulat di belakang -->
                <svg class="circle-bg" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="60" fill="url(#grad)" />
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#4f46e5" stop-opacity="0.2"/>
                            <stop offset="1" stop-color="#3b82f6" stop-opacity="0.2"/>
                        </linearGradient>
                    </defs>
                </svg>
                <!-- Ikon kalender di depan -->
                <svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)" stroke-width="2">
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#4f46e5"/>
                            <stop offset="100%" stop-color="#3b82f6"/>
                        </linearGradient>
                    </defs>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16h.01M12 16h.01M16 16h.01"/>
                </svg>
            </div>
            <h2>Hari Ini Tidak Ada Kegiatan</h2>
        </div>
        `;
        return;
    }

    content.innerHTML = `<div class="agenda-wrapper"></div>`;
    const wrapper = content.querySelector(".agenda-wrapper");

    agendas.forEach(item => {

        const divisiClass = item.divisiClass || 'divisi-default';

        wrapper.innerHTML += `
            <div class="agenda-card ${divisiClass}">
                <div class="bar"></div>
                <div class="agenda-details">
                    <h3>${item.summary}</h3>
                    <div class="agenda-info">
                        <i class="fa-regular fa-clock"></i>
                        <span>
                            ${item.start.substring(11,16)}
                            ${item.end ? ' - ' + item.end.substring(11,16) : ''}
                        </span>
                    </div>
                    <div class="agenda-info">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${item.location ?? '-'}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

// ===============================
// NAVIGASI BULAN
// ===============================
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    fetchMonthData(currentDate);
    startResetTimer();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    fetchMonthData(currentDate);
    startResetTimer();
}

// ===============================
// TOMBOL TODAY
// ===============================
function goToday() {
    currentDate = new Date();
    fetchMonthData(currentDate);
}

// ===============================
// LOAD PERTAMA
// ===============================
fetchMonthData(currentDate);
