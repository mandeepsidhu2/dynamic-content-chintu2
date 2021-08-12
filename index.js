const express = require('express')
const app = express();
const port = 8000;
const fs = require('fs');
// init Konva
require("konva-node");
const { videoWidth } = require("./dynamic-video/consts");
const {generate} = require("./dynamic-video/index");
const dummyTemplate = {
    bg:"#FCFCFC",
    texts:[
        {
            align: "center",
            x: -videoWidth,
            width: videoWidth,
            y: 150,
            fontSize: 200,
            fontStyle: "bold",
            fill: "#1E3740",
            text: "Hello",
        },{
            align: "center",
            x: videoWidth,
            width: videoWidth,
            y: 350,
            fontSize: 150,
            fill: "#1E3740",
            text: "from",
        },{
            align: "center",
            x: 0,
            width: videoWidth,
            y: 500,
            fontSize: 300,
            fontStyle: "bold",
            fill: "#129A74",
            text: "CHINTU",
            opacity: 0,
        }
    ]
}

app.get('/', (req, res) => {
    res.send('Dynamic content for Chintu 2.0!')
});

app.get('/get-dynamic-video', async (req, res) => {
    try {
        dummyTemplate.texts[2].text = req.query.name;
        const result = await generate(dummyTemplate);
        res.send('Dynamic content for Chintu 2.0!')
    }catch (e) {
        res.send('Error! Something Went wrong....')
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});
