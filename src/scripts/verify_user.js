require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const verifyLatestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/daret_api');
        console.log('Connected to MongoDB');

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log('No users found');
            return;
        }

        console.log(`Found user: ${user.email} (Current KYC: ${user.kycVerified})`);

        user.kycVerified = true;
        user.kycStatus = 'approved';
        await user.save();

        console.log(`Successfully verified user: ${user.email}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

verifyLatestUser();
