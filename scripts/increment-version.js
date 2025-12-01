#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, '..', 'version.json');

try {
  let versionData;
  
  // Read existing version or create new one
  try {
    const content = fs.readFileSync(versionPath, 'utf8');
    versionData = JSON.parse(content);
  } catch (error) {
    versionData = {
      version: '1.0.0',
      build: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Increment build number
  versionData.build += 1;
  versionData.lastUpdated = new Date().toISOString();

  // Write back to file
  fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');
  
  console.log(`✅ Version incremented to v${versionData.version} (Build ${versionData.build})`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error incrementing version:', error);
  process.exit(1);
}
