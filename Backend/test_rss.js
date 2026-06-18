const axios = require('axios');

(async () => {
  try {
    const channelId = 'UC7YUb1k1xc-jV5PY2a5pZJQ';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const response = await axios.get(apiUrl);
    console.log(response.data.feed.title);
    response.data.items.forEach(item => {
      console.log(item.title + ':' + item.link);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
