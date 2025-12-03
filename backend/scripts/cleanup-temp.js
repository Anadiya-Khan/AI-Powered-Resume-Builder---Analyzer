const fs = require('fs');
const path = require('path');

const tempDir = path.join(process.cwd(), 'public', 'temp');

if (!fs.existsSync(tempDir)) {
  console.log('No temp directory found at', tempDir);
  process.exit(0);
}

try {
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Removed temp directory:', tempDir);
} catch (err) {
  console.error('Failed to remove temp directory:', err);
  process.exit(1);
}
