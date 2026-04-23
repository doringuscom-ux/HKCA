const EventRegistration = require('../models/EventRegistration');

const startCleanupJob = () => {
    console.log('[Cleanup Job] Initialized. Checking for expired pending registrations every hour.');

    const cleanup = async () => {
        try {
            // Find pending registrations older than 24 hours
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const result = await EventRegistration.updateMany(
                {
                    status: 'pending',
                    createdAt: { $lt: twentyFourHoursAgo }
                },
                {
                    $set: { 
                        status: 'cancelled',
                        cancellationReason: 'Payment not completed within 24 hours (Auto-cancelled)'
                    }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`[Cleanup Job] Auto-cancelled ${result.modifiedCount} pending registrations at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
            }
        } catch (error) {
            console.error('[Cleanup Job] Error during execution:', error.message);
        }
    };

    // Run every hour (3,600,000 ms)
    setInterval(cleanup, 3600000);
    
    // Also run once on startup
    cleanup();
};

module.exports = { startCleanupJob };
