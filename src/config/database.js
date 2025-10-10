const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            this.connection = await mongoose.connect(
                process.env.MONGODB_URI || 'mongodb://localhost:27017/daret',
                options
            );

            console.log('MongoDB connected successfully');

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            return this.connection;
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected');
        }
    }
}

module.exports = new Database();
