const fs = require('fs');
const path = require('path');

const tempDir = path.join(process.cwd(), 'public', 'temp');
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

fs.mkdirSync(downloadsDir, { recursive: true });

fs.readdir(tempDir, (err, files) => {
  if (err) {
    console.error('Failed to read temp directory:', err.message);
    process.exit(1);
  }

  files.forEach((file) => {
    const from = path.join(tempDir, file);
    const to = path.join(downloadsDir, file);

    // Skip if destination exists
    if (fs.existsSync(to)) {
      console.log('Skipping existing file:', file);
      return;
    }

    try {
      fs.renameSync(from, to);
      console.log('Moved', file, 'to downloads/');
    } catch (e) {
      console.error('Failed to move', file, e.message);
    }
  });

  console.log('Migration complete.');
});
