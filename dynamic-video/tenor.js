const axios = require('axios');

async function getTenorGifUrl(emotion) {
    try {
        const response = await axios.get('https://g.tenor.com/v1/search?q='+emotion+'&key=LIVDSRZULEL&limit=8');
        return response.data.results[0].media[0].gif.url
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    getTenorGifUrl
};