const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../frontend/src');
let errors = 0;

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const dirOfFile = path.dirname(fullPath);
        const resolved = path.resolve(dirOfFile, importPath);
        
        let found = null;
        for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', path.sep + 'index.ts', path.sep + 'index.tsx']) {
          const testPath = resolved + ext;
          if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
            found = testPath;
            break;
          }
        }
        
        if (!found) {
          console.log('MISSING IMPORT in', path.relative(srcDir, fullPath), ':', importPath);
          errors++;
        } else {
          const relativeToSrc = path.relative(srcDir, found);
          const parts = relativeToSrc.split(path.sep);
          let curr = srcDir;
          for (const part of parts) {
            const actualEntries = fs.readdirSync(curr);
            if (!actualEntries.includes(part)) {
              console.log('CASE MISMATCH in', path.relative(srcDir, fullPath), 'import', importPath, '-> looked for', part, 'in', actualEntries);
              errors++;
            }
            curr = path.join(curr, part);
          }
        }
      }
    }
  }
}

checkDir(srcDir);
console.log('Total case/missing import errors found:', errors);
