const cron = require('node-cron');
const contributionService = require('../services/contributionService');

class CronJobs {
    init() {
        // Check for late contributions daily at midnight
        cron.schedule('0 0 * * *', async () => {
            try {
                const count = await contributionService.markLateContributions();
                console.log(`Marked ${count} late contributions`);
            } catch (error) {
                console.error('Error marking late contributions:', error);
            }
        });

        console.log('Cron jobs initialized');
    }
}

module.exports = new CronJobs();
