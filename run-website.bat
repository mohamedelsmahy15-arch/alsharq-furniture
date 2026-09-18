@echo off
title موقع معرض الشرق الأوسط للأثاث
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;C:\Program Files (x86)\cloudflared;%PATH%

echo ====================================================
echo   تشغيل موقع معرض الشرق الأوسط للأثاث ولوحة التحكم
echo ====================================================
echo.
echo [1] رابط جهازك المحلي: http://localhost:3000
echo [2] رابط لوحة التحكم:  http://localhost:3000/admin/login
echo.

start http://localhost:3000
call .\node_modules\.bin\next.cmd dev -p 3000
pause
