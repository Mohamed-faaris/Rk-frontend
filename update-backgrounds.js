const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'web/src/pages');
let modifiedCount = 0;

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx') && file !== 'Index.tsx') {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace standard layout background with transparent
    if (content.includes('className="min-h-screen bg-background')) {
      content = content.replace(/className="min-h-screen bg-background/g, 'className="min-h-screen bg-transparent');
      fs.writeFileSync(filePath, content);
      modifiedCount++;
      console.log(`Modified: ${file}`);
    }
  }
});

console.log(`\nSuccessfully modified ${modifiedCount} files.`);
