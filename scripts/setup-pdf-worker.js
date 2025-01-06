const fs = require('fs');
const path = require('path');
const https = require('https');

const workerVersion = require('pdfjs-dist/package.json').version;
const workerUrl = `https://unpkg.com/pdfjs-dist@${workerVersion}/build/pdf.worker.min.js`;
const destPath = path.join(process.cwd(), 'public', '_next', 'static', 'pdf.worker.min.js');

// Create directories if they don't exist
fs.mkdirSync(path.dirname(destPath), { recursive: true });

// Download worker file
https
  .get(workerUrl, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download worker file: ${response.statusCode}`);
      process.exit(1);
    }

    const file = fs.createWriteStream(destPath);
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('PDF.js worker file downloaded successfully');
    });
  })
  .on('error', (err) => {
    console.error('Error downloading worker file:', err);
    process.exit(1);
  });
