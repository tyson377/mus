const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

function getAvailableVideos() {
  const list = [];
  const dirs = [
    { dir: path.join(__dirname, 'videos'), urlPrefix: '/videos/' },
    { dir: path.join(__dirname, '..', 'dipics'), urlPrefix: '/dipics/' }
  ];

  dirs.forEach(({ dir, urlPrefix }) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(name => {
        const ext = path.extname(name).toLowerCase();
        if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
          const stat = fs.statSync(path.join(dir, name));
          list.push({
            name,
            url: `${urlPrefix}${encodeURIComponent(name)}`,
            size: stat.size
          });
        }
      });
    }
  });

  return list;
}

function handleStaticFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Handle byte range requests for audio and video
  if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`,
        'Access-Control-Allow-Origin': '*'
      });
      res.end();
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // API: List available videos
  if (reqUrl === '/api/videos') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ videos: getAvailableVideos() }));
    return;
  }

  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

  const cleanUrl = reqUrl.replace(/^\/+/, '');
  let filePath = path.join(__dirname, decodeURIComponent(cleanUrl.replace(/\//g, path.sep)));

  if (!fs.existsSync(filePath)) {
    // Check fallback to dipics if asked from root dipics
    const altPath = path.join(__dirname, '..', decodeURIComponent(cleanUrl.replace(/\//g, path.sep)));
    if (fs.existsSync(altPath) && !fs.statSync(altPath).isDirectory()) {
      filePath = altPath;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqUrl);
      return;
    }
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  handleStaticFile(req, res, filePath);
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`Divya Memory Museum server running at http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
