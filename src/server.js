require('dotenv').config();
const app = require('./app');
const database = require('./config/database');
const notificationService = require('./services/notificationService');

const PORT = process.env.PORT || 3000;

// Connect to database
database.connect()
    .then(() => {
        // Start server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Schedule notification reminders
        notificationService.scheduleReminders();

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                database.disconnect();
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('Server closed');
                database.disconnect();
                process.exit(0);
            });
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
