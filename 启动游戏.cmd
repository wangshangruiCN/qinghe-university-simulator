@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:4173' -UseBasicParsing | Out-Null } catch { Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden; Start-Sleep -Milliseconds 900 }"
start "" "http://127.0.0.1:4173"
