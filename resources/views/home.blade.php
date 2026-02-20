@extends('layouts.app')

@section('content')
 <!-- HEADER -->
    <div class="header">
        <div class="logo-area">
            <img src="{{ asset('img/kemenkumham.png') }}" width="30" height="30">
            <div class="text-logo">
                <b>KEMENTERIAN HUKUM</b><br>
                KANTOR WILAYAH<br>
                SUMATERA UTARA
            </div>
        </div>

        <h1 id="monthYear">Januari 2026</h1>
        <div class="nav-container">
            <button class="nav-btn" onclick="prevMonth()">‹</button>
            <button class="btn-today" id="btnTodayDisplay" onclick="goToday()">JANUARI</button>
            <button class="nav-btn" onclick="nextMonth()">›</button>
        </div>
    </div>

    <!-- MAIN -->
    <div class="main">

        <!-- AGENDA (KIRI - BESAR) -->
        <div class="card agenda-area agenda-main">
            <h2 id="agendaTitle">Agenda</h2>

           <div id="agendaContent">
                <div class="loading-msg">
                    <div class="spinner"></div>
                    <div class="msg-text">Memuat agenda...</div>
                </div>
            </div>


            <div class="agenda-legend">
                <div class="legend-item">
                    <div class="color-dot" style="background:#FFEB3B;"></div>
                    <span>Perancang Perundang undangan dan pembinaan hukum</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#06D001;"></div>
                    <span>Bidang pelayanan AHU</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#FF5FCF;"></div>
                    <span>Bidang pelayanan KI</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#00BCD4;"></div>
                    <span>Bagian Tata Usaha dan Umum</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#9E9E9E;"></div>
                    <span>Tidak Ada Divisi</span>
                </div>
            </div>
        </div>

        <!-- KALENDER (KANAN - LEBIH KECIL) -->
        <div class="card calendar-area">
    <div class="calendar-split">

        <!-- KALENDER KIRI -->
        <div class="calendar-left">
            <div class="days-header">
                <div>SENIN</div>
                <div>SELASA</div>
                <div>RABU</div>
                <div>KAMIS</div>
                <div>JUMAT</div>
                <div>SABTU</div>
                <div>MINGGU</div>
            </div>
            <div class="grid" id="calendarGrid"></div>
        </div>

        <!-- DIVISI KANAN -->
        <div class="calendar-right">
            <div class="agenda-legend vertical">
                <div class="legend-item">
                    <div class="color-dot" style="background:#FFEB3B;"></div>
                    <span>Perancang Perundang undangan dan pembinaan hukum</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#06D001;"></div>
                    <span>Bidang pelayanan AHU</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#FF5FCF;"></div>
                    <span>Bidang pelayanan KI</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#00BCD4;"></div>
                    <span>Bagian Tata Usaha dan Umum</span>
                </div>
                <div class="legend-item">
                    <div class="color-dot" style="background:#9E9E9E;"></div>
                    <span>Tidak Ada Divisi</span>
                </div>
            </div>
        </div>

    </div>
</div>


    </div>

    <!-- FOOTER -->
    <div class="footer">
    <div class="marquee">
        <div class="marquee-content">
            <div class="info-icon">!</div>
            <div class="marquee-text">
                <b>Kusuma Pasti Horas,</b> semoga kegiatan berjalan lancar
            </div>
        </div>
    </div>
</div>

@endsection
