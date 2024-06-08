const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://127.0.0.1:5501',
    methods: ['GET', 'POST']
  }
});

// Serve the socket.io client library directly from node_modules
app.get('/socket.io/socket.io.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Allow CORS from your specific origin
app.use(cors({
  origin: 'http://127.0.0.1:5501' // Change this to match the origin of your HTML page
}));

// Generate random data every second
setInterval(() => {
  const temperature = (Math.random() * 40).toFixed(2); // Random temperature between 0 and 40
  const humidity = (Math.random() * 100).toFixed(2);   // Random humidity between 0 and 100
  io.emit('sensorData', { temperature, humidity });
  console.log('Emitted sensor data:', { temperature, humidity });
},5000);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
