const https = require('https');

async function getTenorGifUrl(emotion) {
    https.get('https://g.tenor.com/v1/search?q='+emotion+'&key=LIVDSRZULEL&limit=8',  (res) => {
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            const response = JSON.parse(body);
            return response.results[0].media[0].gif.url

        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}
module.exports = {
    getTenorGifUrl
};