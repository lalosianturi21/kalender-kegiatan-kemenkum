let currentDate = new Date();
const realToday = new Date();
realToday.setHours(0, 0, 0, 0);

let calendarEvents = [];
let resetTimer = null;

const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// ================= FORMAT DATE =================
function formatDate(year, monthIndex, day) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

// ================= FETCH 1 BULAN PENUH =================
function fetchEventsForMonth() {

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1️⃣ Langsung render dulu tanpa event
    calendarEvents = [];
    renderCalendar();

    const requests = [];

    for (let d = 1; d <= daysInMonth; d++) {

        const day = String(d).padStart(2, '0');
        const monthStr = String(month + 1).padStart(2, '0');
        const formattedDate = `${day}-${monthStr}-${year}`;

        requests.push(
            fetch(`/calendar/import?tanggal=${formattedDate}`)
                .then(res => res.json())
                .then(data => {
                    calendarEvents = calendarEvents.concat(data);
                })
        );
    }

    // 2️⃣ Setelah semua selesai → render ulang untuk update badge
    Promise.all(requests).then(() => {
        renderCalendar();
    });
}


// ================= RESET TIMER =================
function startResetTimer() {
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        currentDate = new Date();
        fetchEventsForMonth();
    }, 20000);
}

// ================= RENDER CALENDAR =================
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

    for (let i = firstDay; i > 0; i--) {
        grid.innerHTML += `<div class="cell muted"><div class="date-box">${prevDays - i + 1}</div></div>`;
    }

    const todayIndex = Math.floor((firstDay + realToday.getDate() - 1) / 7);

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

    let nextDay = 1;
    while (grid.children.length < 42) {
        grid.innerHTML += `<div class="cell muted"><div class="date-box">${nextDay}</div></div>`;
        nextDay++;
    }

    const active = document.querySelector(".cell.active");
    if (active) showAgenda(realToday.getDate(), monthNames[month], year, active);
}

// ================= SHOW AGENDA =================
function showAgendaWithReset(day, monthName, year, el) {
    showAgenda(day, monthName, year, el);
    startResetTimer();
}

function showAgenda(day, monthName, year, el) {

    document.querySelectorAll(".cell").forEach(c => c.classList.remove("active"));
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
        content.innerHTML = `<div class="no-agenda-card">
            <h2>Hari Ini Tidak Ada Kegiatan</h2>
        </div>`;
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
                        <span>${item.start.substring(11,16)}
                        ${item.end ? ' - ' + item.end.substring(11,16) : ''}</span>
                    </div>
                    <div class="agenda-info">
                        <span>${item.location ?? '-'}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

// ================= NAVIGATION =================
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    fetchEventsForMonth();
    startResetTimer();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    fetchEventsForMonth();
    startResetTimer();
}

function goToday() {
    currentDate = new Date();
    fetchEventsForMonth();
}

// ================= INITIAL LOAD =================
fetchEventsForMonth();
