const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'web/src/pages');
let modifiedCount = 0;

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx') && file !== 'Index.tsx') {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Revert transparent to background
    if (content.includes('className="min-h-screen bg-transparent')) {
      content = content.replace(/className="min-h-screen bg-transparent/g, 'className="min-h-screen bg-background');
      fs.writeFileSync(filePath, content);
      modifiedCount++;
      console.log(`Reverted: ${file}`);
    }
  }
});

console.log(`\nSuccessfully reverted ${modifiedCount} files.`);
