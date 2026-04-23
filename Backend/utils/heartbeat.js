const https = require('https');

const startHeartbeat = () => {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        console.warn('[Heartbeat] BACKEND_URL not found in environment variables. Heartbeat skipped.');
        return;
    }

    // Ping the root or a specific health endpoint
    const healthUrl = `${backendUrl.replace(/\/$/, '')}/api/health`;

    console.log(`[Heartbeat] Service initialized. Pinging ${healthUrl} every 10 minutes.`);

    const ping = () => {
        https.get(healthUrl, (res) => {
            if (res.statusCode === 200) {
                console.log(`[Heartbeat] Ping successful at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
            } else {
                console.warn(`[Heartbeat] Ping returned status ${res.statusCode} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
            }
        }).on('error', (err) => {
            console.error(`[Heartbeat] Ping failed at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}: ${err.message}`);
        });
    };

    // Initial ping
    ping();

    // Schedule ping every 10 minutes (600,000 ms)
    setInterval(ping, 600000);
};

module.exports = { startHeartbeat };
