@echo off
:: Jalankan server Laravel di background
start /b php artisan serve

:: Tunggu 3 detik agar server siap
timeout /t 3 /nobreak > nul

:: Jalankan Chrome dalam mode Kiosk (Fullscreen penuh tanpa tombol navigasi)
start "" "chrome.exe" --autoplay-policy=no-user-gesture-required --kiosk http://127.0.0.1:8000
