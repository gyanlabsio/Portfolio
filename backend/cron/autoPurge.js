const cron = require('node-cron');
const modelsMap = {
    'project': require('../models/Project'),
    'service': require('../models/Service'),
    'testimonial': require('../models/Testimonial'),
    'contact': require('../models/Contact'),
    'comment': require('../models/Comment'),
    'lead': require('../models/Lead'),
    'content': require('../models/Content'),
    'file': require('../models/File'),
};

const RETENTION_DAYS = 60;

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily recycle bin auto-purge job...');
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

        let totalPurged = 0;

        for (const [moduleName, Model] of Object.entries(modelsMap)) {
            // Find documents where deletedAt is older than cutoffDate
            const result = await Model.deleteMany({
                deletedAt: { $ne: null, $lt: cutoffDate }
            });
            if (result.deletedCount > 0) {
                console.log(`Purged ${result.deletedCount} items from ${moduleName}`);
                totalPurged += result.deletedCount;
            }
        }

        console.log(`Auto-purge completed. Total items permanently deleted: ${totalPurged}`);
    } catch (error) {
        console.error('Error during auto-purge:', error);
    }
});
