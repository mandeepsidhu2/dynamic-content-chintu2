const fs = require('fs');
const AWS = require('aws-sdk');
const util = require('util')
const ID = 'AKIAUPH5WFXZUXB27I7W';
const SECRET = '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';
const BUCKET_NAME = 'hackathon-chintu2-dynamic-content';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

    const uploadFile = async (fileName) => {
        const writeFileAsync = util.promisify(fs.writeFile)
        await writeFileAsync(`./${fileName.name}`, fileName.data)
        const fileContent = fs.readFileSync(fileName.name,'utf8');

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName.name,
            Body: fileContent,
            ACL:'public-read',
            ContentType: 'image/png'
        };

       const x = await s3.putObject(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });
       return x
    }

exports.uploadFile = uploadFile;

