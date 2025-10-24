const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    // Remove query parameters and decode URI
    let urlPath = req.url.split('?')[0];
    let filePath;
    
    if (urlPath === '/' || urlPath === '') {
        filePath = path.join(__dirname, 'printing website.html');
    } else {
        filePath = path.join(__dirname, decodeURIComponent(urlPath));
    }
    
    console.log(`Serving file: ${filePath}`);
    
    // Set content type based on file extension
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    switch (ext) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log('File not found:', filePath);
            res.writeHead(404);
            res.end('File not found: ' + filePath);
            return;
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Server running on http://127.0.0.1:8080');
    console.log('Main page: http://127.0.0.1:8080/');
    console.log('Server address:', server.address());
});
