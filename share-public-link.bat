@echo off
title مشاركة رابط معرض الشرق الأوسط أونلاين
cd /d "%~dp0"
set PATH=C:\Program Files (x86)\cloudflared;%PATH%

echo ====================================================
echo   جاري إنشاء رابط إنترنت عام لموقع الشرق الأوسط...
echo ====================================================
echo.
echo انسخ الرابط الذي سينتهي بـ .trycloudflare.com وشاركه مع أي شخص!
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
pause
