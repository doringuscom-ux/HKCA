const yts = require('yt-search');

(async () => {
  try {
    const list = await yts({ search: 'HKCA Haryana Canoeing', pages: 1 });
    const videos = list.videos.slice(0, 5);
    console.log(videos.map(v => v.title + ': ' + v.url));
  } catch (error) {
    console.error(error);
  }
})();
