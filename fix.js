const fs = require('fs');
const path = require('path');

function replaceAbsoluteImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceAbsoluteImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /from ['"]src\/(.*?)['"]/g;
      if (regex.test(content)) {
        const relativeToSrc = path.relative(path.join(process.cwd(), 'src'), fullPath);
        const depth = relativeToSrc.split(path.sep).length - 1;
        
        let prefix = '';
        if (depth === 0) prefix = './';
        else if (depth === 1) prefix = '../';
        else if (depth === 2) prefix = '../../';
        else if (depth === 3) prefix = '../../../';
        
        content = content.replace(regex, (match, importPath) => {
          return `from '${prefix}${importPath.replace(/\\/g, '/')}'`;
        });
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

replaceAbsoluteImports(path.join(process.cwd(), 'src'));
