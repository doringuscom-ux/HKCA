const ytch = require('yt-channel-info');

ytch.getChannelVideos('@HKCA-HaryanaCanoeing', 'newest').then((response) => {
  console.log(response.items.slice(0, 5).map(i => i.title + ': ' + i.videoId));
}).catch((err) => {
  console.log(err);
});
