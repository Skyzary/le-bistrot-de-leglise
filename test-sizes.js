const fs = require('fs');
const path = require('path');
const dir = 'public/images/gallery';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
files.forEach(f => {
  const p = path.join(dir, f);
  const buf = fs.readFileSync(p);
  // Basic JPEG dimension extraction
  let i = 0;
  if (buf[i] == 0xFF && buf[i+1] == 0xD8) {
    i += 2;
    while (i < buf.length) {
      if (buf[i] == 0xFF) {
        if (buf[i+1] == 0xC0 || buf[i+1] == 0xC2) {
          const h = buf.readUInt16BE(i+5);
          const w = buf.readUInt16BE(i+7);
          console.log(`${f}: ${w}x${h}`);
          break;
        } else {
          i += 2 + buf.readUInt16BE(i+2);
        }
      } else {
        break;
      }
    }
  }
});
