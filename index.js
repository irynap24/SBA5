const express = require('express');
const axios = require('axios');
const app = express();
const port = 6000;


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Middleware to check for API key 
app.use((req, res, next) => {
    if (!req.headers['x-api-key']) {
        return res.status(403).send('API key is required');
    }
    next();
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});