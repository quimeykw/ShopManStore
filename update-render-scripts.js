#!/usr/bin/env node

const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'render-setup': 'node render-setup.js',
  'render-verify': 'node render-verify.js',
  'deploy-render': 'git add . && git commit -m "Deploy to Render" && git push origin main'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Scripts de Render añadidos a package.json');