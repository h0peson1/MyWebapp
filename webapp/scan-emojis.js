const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\hw055\\Desktop\\All My works\\All My works\\Website Work\\webapp\\src';

// Simple emoji regex
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (emojiRegex.test(content)) {
        console.log(`EMOJI FOUND IN: ${fullPath}`);
        // Find matching lines
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (emojiRegex.test(line)) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

walkDir(srcDir);
