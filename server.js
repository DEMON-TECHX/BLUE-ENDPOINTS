const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get a random joke in JSON format
app.get('/api/joke', (req, res) => {
    const jokesPath = path.join(__dirname, 'jokes.json');

    fs.readFile(jokesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading jokes file:', err);
            const errorResponse = {
                creator: "BLUE DEMON",
                status: 500,
                success: false,
                joke: "Failed to load jokes."
            };
            return res
                .status(500)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(errorResponse, null, 2));
        }

        const jokes = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * jokes.length);
        const randomJoke = jokes[randomIndex];

        const response = {
            creator: "BLUE DEMON",
            status: 200,
            success: true,
            joke: randomJoke.joke
        };

        // Pretty-print the JSON response
        res
            .status(200)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(response, null, 2));
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});