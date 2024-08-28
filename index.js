const http = require('http');
const https = require('https');
const { URL } = require('url'); // Use URL from 'url' module

const API_KEY = '5e77337e423aa2926d00668f14f3e991';
const PORT = 3000;

const server = http.createServer((req, res) => {
    const baseUrl = `http://${req.headers.host}`;
    const parsedUrl = new URL(req.url, baseUrl); // Use a different variable name for the URL object
    const city = parsedUrl.searchParams.get('city'); // Get the city parameter

    if (parsedUrl.pathname === '/weather' && req.method === 'GET') {
        if (!city) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'City query parameter is required' }));
            return;
        }

        const apiRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        https.get(apiRequestUrl, (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                if (apiRes.statusCode === 200) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(data);
                } else {
                    res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Failed to fetch weather data: ${JSON.parse(data).message}` }));
                }
            });
        }).on('error', (e) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching weather data' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found. Use /weather?city=cityname' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
