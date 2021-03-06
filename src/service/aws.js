const fs = require('fs');
const AWS = require('aws-sdk');
const util = require('util')
const ID = process.env.S3_ACCESS_KEY;
const SECRET = process.env.S3_SECRET_KEY;
const BUCKET_NAME = 'hackathon-chintu2-dynamic-content';
const BUCKET_LINK = "https://hackathon-chintu2-dynamic-content.s3.ap-south-1.amazonaws.com/"
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = async (fileName,contentType="image/png") => {
    // const writeFileAsync = util.promisify(fs.writeFile)
    // await writeFileAsync(`./${fileName.name}`, fileName.data)
    // let fileN = fileName.name
    // fileN = fileN.substr(0, fileN.lastIndexOf(".")).split(" ").join("").split(".").join("")
    // const filePath = fileName.name
    const filePath = './outImage/'+fileName
    await uploadToS3(contentType, fileName, filePath)
    return (BUCKET_LINK + fileName)
}

const uploadGIF = async (fileName,contentType="image/gif") => {
    // const writeFileAsync = util.promisify(fs.writeFile)
    // await writeFileAsync(`./${fileName.name}`, fileName.data)
    // let fileN = fileName.name
    // fileN = fileN.substr(0, fileN.lastIndexOf(".")).split(" ").join("").split(".").join("")
    // const filePath = fileName.name
    const filePath = './outGif/'+fileName
    await uploadToS3(contentType, fileName, filePath)
    return (BUCKET_LINK + fileName)
}

const uploadGIFBuffer = async (fileName,buffer) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ACL:'public-read',
        ContentEncoding: 'base64',
        ContentType: "image/gif"
    };

    s3.putObject(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
    return (BUCKET_LINK + fileName)
}

const uploadVideo = async (fileN) => {
    const contentType =  'video/mp4'
    const filePath = './video/'+fileN
    await uploadToS3(contentType, fileN, filePath)
    return (BUCKET_LINK + fileN)
}
const uploadToS3= async (contentType, fileN, filePath)  =>{
    fs.readFile(filePath, function (err, data) {
        if (err) {
            console.log('fs error', err);
        } else {
            const params = {
                Bucket: BUCKET_NAME,
                Key: fileN,
                Body: data,
                ACL:'public-read',
                ContentEncoding: 'base64',
                ContentType: contentType
            };

            s3.putObject(params, function (err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        }
    });
}

exports.uploadFile = uploadFile
exports.uploadVideo = uploadVideo
exports.uploadGIF = uploadGIF
exports.uploadGIFBuffer = uploadGIFBuffer

