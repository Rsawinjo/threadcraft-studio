const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for root - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route for any HTML file
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `public/${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public/index.html'));
        }
    });
});

// Fallback - if no file found, serve index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

