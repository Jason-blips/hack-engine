# Hack Engine - 启动后端与前端（PowerShell）
# 用法: .\start.ps1  或在 PowerShell 中 & .\start.ps1

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) { $ProjectRoot = Get-Location }

Write-Host ""
Write-Host " [Hack Engine] 启动后端与前端..." -ForegroundColor Green
Write-Host "  后端: http://localhost:8080"
Write-Host "  前端: http://localhost:3000"
Write-Host "  关闭对应窗口即可停止服务。" -ForegroundColor Gray
Write-Host ""

# 新窗口启动后端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot'; .\mvnw.cmd spring-boot:run" -WindowStyle Normal

Start-Sleep -Seconds 3

# 新窗口启动前端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\hack-engine-web'; npm start" -WindowStyle Normal

Write-Host " 两个窗口已打开。请等待后端启动完成后再访问前端。" -ForegroundColor Cyan
Write-Host ""
