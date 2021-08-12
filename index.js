const express = require('express')
require('dotenv').config()
const app = express();
const port = 8000;
const fileUpload = require('express-fileupload');
app.use(fileUpload());
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

const awsService = require('./src/service/aws.js');

app.post('/post', async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const link = await awsService.uploadFile(req.files.file);
        res.status(200).json(link)
    } catch (e) {
        next(e)
    }
})
