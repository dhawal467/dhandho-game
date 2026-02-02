# Quick Diagnostic for Dhandho Game Blank Screen Issue
# Run this to identify the problem

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Dhandho Game - Quick Diagnostic" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check dependencies
Write-Host "✓ Dependencies Check:" -ForegroundColor Yellow
$checks = @{
    "boardgame.io" = Test-Path ".\node_modules\boardgame.io"
    "React"        = Test-Path ".\node_modules\react"
    "Tailwind"     = Test-Path ".\node_modules\tailwindcss"
}

foreach ($dep in $checks.GetEnumerator()) {
    if ($dep.Value) {
        Write-Host "  ✓ $($dep.Key) - INSTALLED" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $($dep.Key) - MISSING!" -ForegroundColor Red
    }
}

# Check key files
Write-Host "`n✓ Files Check:" -ForegroundColor Yellow
$files = @("src\App.jsx", "src\main.jsx", "index.html", "src\index.css")
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "  ✓ $f exists" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $f MISSING!" -ForegroundColor Red
    }
}

# Check dev server
Write-Host "`n✓ Dev Server:" -ForegroundColor Yellow
try {
    $server = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($server) {
        Write-Host "  ✓ Running on port 5173" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ NOT running - Start with 'npm run dev'" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  ? Cannot determine server status" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS TO FIX BLANK SCREEN:" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

Write-Host "1. Make sure dev server is running:" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor Cyan

Write-Host "2. Open browser console (F12) at:" -ForegroundColor White
Write-Host "   http://localhost:5173`n" -ForegroundColor Cyan

Write-Host "3. Look for RED error messages in Console tab`n" -ForegroundColor White

Write-Host "4. Common errors and fixes:" -ForegroundColor Yellow
Write-Host "   • 'Cannot find module' -> Run: npm install" -ForegroundColor White
Write-Host "   • 'Unexpected token' -> Syntax error in code" -ForegroundColor White
Write-Host "   • 'Failed to fetch' -> Server not running" -ForegroundColor White
Write-Host "   • No errors but blank -> Check Network tab`n" -ForegroundColor White

Write-Host "5. Share the EXACT error message for help`n" -ForegroundColor Yellow

Write-Host "====================================`n" -ForegroundColor Cyan
