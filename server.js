const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let count = 0;

// Serve the static files in the public folder
app.use(express.static(__dirname + '/public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current count to the new client
    socket.emit('updateCount', count);

    // Handle button clicks
    socket.on('incrementCount', () => {
        count++;
        // Send the updated count to all connected clients
        io.emit('updateCount', count);
    });

    // Handle socket disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    app.post('/reset', function (req, res) {
        count = 0;
        io.emit('countUpdated', count);
        res.send('Count has been reset');
    });

});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
