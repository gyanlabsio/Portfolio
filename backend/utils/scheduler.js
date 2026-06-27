const Content = require('../models/Content');

const startPublishScheduler = () => {
    console.log('Publish scheduler started (polling every 60 seconds)...');
    
    // Check every 60 seconds
    setInterval(async () => {
        try {
            const now = new Date();
            // Find content with SCHEDULED status and publishedAt date that is now or in the past
            const scheduledPosts = await Content.find({
                status: 'SCHEDULED',
                publishedAt: { $lte: now }
            });

            if (scheduledPosts.length > 0) {
                console.log(`[Scheduler] Found ${scheduledPosts.length} post(s) to publish...`);
                for (const post of scheduledPosts) {
                    post.status = 'PUBLISHED';
                    await post.save();
                    console.log(`[Scheduler] Published: "${post.title}" (ID: ${post._id})`);
                }
            }
        } catch (error) {
            console.error('[Scheduler Error] Error in auto-publish scheduler:', error);
        }
    }, 60000); // 60 seconds
};

module.exports = startPublishScheduler;
