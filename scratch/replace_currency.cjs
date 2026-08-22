const fs = require('fs');
const path = require('path');

const targets = [
  path.resolve(__dirname, '../src'),
  path.resolve(__dirname, '../frontend/src'),
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Replace currency dollar signs:
      // 1. $ followed by { (template literal for numbers where $ is displayed) -> ₹${
      // e.g. `$${Number( -> `₹${Number(
      content = content.replace(/\$\$\{/g, '₹${');
      // 2. -$${ -> -₹${
      content = content.replace(/-\$\$\{/g, '-₹${');
      // 3. +$${ -> +₹${
      content = content.replace(/\+\$\$\{/g, '+₹${');
      // 4. Literal dollar amounts like $685,000 or $148,500 or $50,000 or $10,372
      content = content.replace(/\$([0-9]+[0-9,]*)/g, '₹$1');
      // 5. -$[0-9]
      content = content.replace(/-\$([0-9]+[0-9,]*)/g, '-₹$1');
      // 6. +$[0-9]
      content = content.replace(/\+\$([0-9]+[0-9,]*)/g, '+₹$1');
      // 7. Amount (USD) -> Amount (INR)
      content = content.replace(/Amount \(USD\)/g, 'Amount (INR / ₹)');
      content = content.replace(/\(USD\)/g, '(INR / ₹)');
      content = content.replace(/USD/g, 'INR');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated currency in:', path.relative(path.resolve(__dirname, '..'), fullPath));
      }
    }
  }
}

targets.forEach((t) => {
  if (fs.existsSync(t)) processDir(t);
});
console.log('Currency replacement completed.');
