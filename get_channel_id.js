const axios = require('axios');
axios.get('https://www.youtube.com/@HKCA-HaryanaCanoeing').then(res => {
  const match = res.data.match(/channel_id=([^"]+)/);
  console.log(match ? match[1] : 'Not found');
}).catch(console.log);
