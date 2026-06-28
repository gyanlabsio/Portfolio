require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');
const startPublishScheduler = require('./utils/scheduler');

const http = require('http');
const { Server } = require('socket.io');

// --- Start Server ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    startPublishScheduler();
    
    const allowedOrigins = [
        'https://gyanaranjandas.me',
        'https://www.gyanaranjandas.me',
        'http://localhost:5173',
        'http://localhost:5174',
    ];
    if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
        allowedOrigins.push(process.env.CLIENT_URL);
    }
    if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
        allowedOrigins.push(process.env.FRONTEND_URL);
    }

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
        // Admin clients will join the 'admin' room to receive analytics events
        socket.on('join_admin', () => {
            socket.join('admin');
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();

module.exports = { app };
