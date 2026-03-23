require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

// --- Start Server ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();

module.exports = app;
