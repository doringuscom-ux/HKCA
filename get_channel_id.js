const axios = require('axios');
axios.get('https://www.youtube.com/@HKCA-HaryanaCanoeing').then(res => {
  const matches = res.data.match(/https:\/\/www\.youtube\.com\/channel\/([^"]+)/g);
  if (matches) {
    const unique = [...new Set(matches.map(m => m.split('/channel/')[1]))];
    console.log(unique);
  } else {
    console.log('Not found');
  }
}).catch(console.log);
