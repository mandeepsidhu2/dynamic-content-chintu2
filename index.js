const express = require('express')
const app = express();
const port = 8000;
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Dynamic content for Chintu 2.0!')
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
        await awsService.uploadFile(req.files.file);
        res.status(Status.OK).json(await Success(result))
    } catch (e) {
        next(e)
    }
})
