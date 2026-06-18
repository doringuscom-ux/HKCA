const axios = require('axios');

(async () => {
  try {
    const res = await axios.get('https://www.youtube.com/@HKCA-HaryanaCanoeing/videos');
    
    const match = res.data.match(/var ytInitialData = ({.*?});<\/script>/);
    if (!match) {
      console.log('No ytInitialData found');
      return;
    }
    
    const rawJson = match[1];
    
    // Improved regex to find video entries specifically
    // "videoId":"xxxx","thumbnail":{...},"title":{"runs":[{"text":"xxxx"}]}
    const videoRegex = /"videoId":"([^"]+)","thumbnail":\{.*?\}.*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g;
    
    let result;
    const videos = [];
    while ((result = videoRegex.exec(rawJson)) !== null) {
      videos.push({
        videoId: result[1],
        title: result[2]
      });
    }
    
    // Remove duplicates based on videoId
    const uniqueVideos = Array.from(new Map(videos.map(item => [item.videoId, item])).values());
    console.log(uniqueVideos.slice(0, 10));
    
  } catch (error) {
    console.error(error.message);
  }
})();
