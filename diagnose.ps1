# Dhandho Game - Automated Diagnostic Script
# This script checks for common issues causing blank screens

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Dhandho Game Diagnostic Tool" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\dhawa\.gemini\antigravity\scratch\dhandho-game"

# Check 1: Verify we're in the right directory
Write-Host "[1/7] Checking project directory..." -ForegroundColor Yellow
if (Test-Path $projectPath) {
    Write-Host "  ✓ Project directory exists" -ForegroundColor Green
    Set-Location $projectPath
}
else {
    Write-Host "  ✗ Project directory not found!" -ForegroundColor Red
    Write-Host "  Expected: $projectPath" -ForegroundColor Red
    Exit 1
}

# Check 2: Node.js and npm
Write-Host ""
Write-Host "[2/7] Checking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    $npmVersion = npm --version 2>&1
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Node.js or npm not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Exit 1
}

# Check 3: node_modules
Write-Host ""
Write-Host "[3/7] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    Write-Host "  ✓ node_modules folder exists" -ForegroundColor Green
    
    # Check for key dependencies
    $hasBoardgameIO = Test-Path ".\node_modules\boardgame.io"
    $hasReact = Test-Path ".\node_modules\react"
    $hasTailwind = Test-Path ".\node_modules\tailwindcss"
    
    if ($hasBoardgameIO) {
        Write-Host "  ✓ boardgame.io is installed" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ boardgame.io is NOT installed" -ForegroundColor Red
        Write-Host "  Run: npm install" -ForegroundColor Yellow
    }
    
    if ($hasReact) {
        Write-Host "  ✓ React is installed" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ React is NOT installed" -ForegroundColor Red
        Write-Host "  Run: npm install" -ForegroundColor Yellow
    }
    
    if ($hasTailwind) {
        Write-Host "  ✓ Tailwind CSS is installed" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ Tailwind CSS is NOT installed" -ForegroundColor Red
        Write-Host "  Run: npm install" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ✗ node_modules folder NOT found" -ForegroundColor Red
    Write-Host "  CRITICAL: You need to run 'npm install'" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Run this command now:" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor Cyan
    Exit 1
}

# Check 4: Essential files
Write-Host ""
Write-Host "[4/7] Checking essential files..." -ForegroundColor Yellow
$files = @(
    "package.json",
    "index.html",
    "src\main.jsx",
    "src\App.jsx",
    "src\index.css"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $file NOT found" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Check 5: Dev server status
Write-Host ""
Write-Host "[5/7] Checking dev server..." -ForegroundColor Yellow
try {
    $serverRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($serverRunning) {
        Write-Host "  ✓ Dev server is running on port 5173" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ Dev server is NOT running" -ForegroundColor Yellow
        Write-Host "  Run: npm run dev" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "  ⚠ Cannot check server status" -ForegroundColor Yellow
}

# Check 6: Check for common file issues
Write-Host ""
Write-Host "[6/7] Checking file contents..." -ForegroundColor Yellow
try {
    $appContent = Get-Content "src\App.jsx" -Raw
    if ($appContent -match "boardgame\.io") {
        Write-Host "  ✓ App.jsx imports boardgame.io" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ App.jsx doesn't import boardgame.io (using test version?)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  ✗ Cannot read App.jsx" -ForegroundColor Red
}

# Check 7: Configuration files
Write-Host ""
Write-Host "[7/7] Checking configuration..." -ForegroundColor Yellow
$configFiles = @("vite.config.js", "tailwind.config.js", "postcss.config.js")
foreach ($config in $configFiles) {
    if (Test-Path $config) {
        Write-Host "  ✓ $config exists" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $config NOT found" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Diagnostic Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".\node_modules")) {
    Write-Host "ACTION REQUIRED:" -ForegroundColor Red
    Write-Host "Dependencies are NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this command RIGHT NOW:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  npm install" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will install all required packages including:" -ForegroundColor White
    Write-Host "  - boardgame.io" -ForegroundColor White
    Write-Host "  - React" -ForegroundColor White
    Write-Host "  - Tailwind CSS" -ForegroundColor White
    Write-Host "  - Vite" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation completes, run:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Cyan
}
else {
    try {
        $serverRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
        if (-not $serverRunning) {
            Write-Host "Server is not running. Start it with:" -ForegroundColor Yellow
            Write-Host "  npm run dev" -ForegroundColor Cyan
        }
        else {
            Write-Host "Everything looks good!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Server is running at: http://localhost:5173" -ForegroundColor Green
            Write-Host ""
            Write-Host "If you still see a blank screen:" -ForegroundColor Yellow
            Write-Host "1. Open browser to http://localhost:5173" -ForegroundColor White
            Write-Host "2. Press F12 to open DevTools" -ForegroundColor White
            Write-Host "3. Check Console tab for error messages" -ForegroundColor White
            Write-Host "4. Share those errors for further help" -ForegroundColor White
        }
    }
    catch {
        Write-Host "Run the dev server:" -ForegroundColor Yellow
        Write-Host "  npm run dev" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
