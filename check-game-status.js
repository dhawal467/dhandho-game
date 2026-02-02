// Simple Node script to check if all dependencies are present
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Checking Dhandho Game Status...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules folder exists');
} else {
    console.log('❌ node_modules folder NOT found');
    console.log('   Run: npm install');
    process.exit(1);
}

// Check for critical dependencies
const criticalDeps = [
    'boardgame.io',
    'react',
    'react-dom',
    'vite'
];

let allDepsFound = true;
criticalDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
        console.log(`✅ ${dep} installed`);
    } else {
        console.log(`❌ ${dep} NOT found`);
        allDepsFound = false;
    }
});

// Check if all source files exist
const requiredFiles = [
    'src/App.jsx',
    'src/main.jsx',
    'src/index.css',
    'src/game/Game.js',
    'src/game/constants.js',
    'src/components/GameBoard.jsx',
    'src/components/Card.jsx',
    'index.html',
    'package.json'
];

console.log('\n📁 Checking source files...');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} NOT found`);
        allDepsFound = false;
    }
});

// Check App.jsx for common issues
console.log('\n🔧 Checking App.jsx configuration...');
const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf-8');

if (appJsxContent.includes('multiplayer: Local()')) {
    console.log('⚠️  WARNING: App.jsx contains "multiplayer: Local()" which causes connection issues');
    console.log('   This should be removed for local play');
} else if (appJsxContent.includes('debug: true')) {
    console.log('✅ Debug mode enabled (good for testing)');
} else {
    console.log('ℹ️  Debug mode not explicitly enabled');
}

if (allDepsFound) {
    console.log('\n✨ All checks passed! The game should be ready to run.');
    console.log('\nTo start the game:');
    console.log('  npm run dev');
    console.log('\nThen open: http://localhost:5173');
} else {
    console.log('\n❌ Some issues found. Please fix them before running the game.');
}
