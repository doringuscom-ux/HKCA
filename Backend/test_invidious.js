const axios = require('axios');

(async () => {
  try {
    const channelId = 'UC7YUb1k1xc-jV5PY2a5pZJQ';
    // Using a public Invidious instance (or a list of instances)
    const res = await axios.get(`https://invidious.jing.rocks/api/v1/channels/${channelId}/videos`);
    
    console.log(`Found ${res.data.length} videos`);
    res.data.slice(0, 5).forEach(v => {
      console.log(v.title + ': ' + v.videoId);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
