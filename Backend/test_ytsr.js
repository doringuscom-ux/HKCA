const YouTube = require("youtube-sr").default;

(async () => {
  try {
    const channel = await YouTube.getChannel("https://www.youtube.com/@HKCA-HaryanaCanoeing");
    const videos = await channel.fetchVideos();
    console.log(videos.slice(0, 5).map(v => v.title + ': ' + v.id));
  } catch (error) {
    console.error(error);
  }
})();
