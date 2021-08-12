const path = require("path");
const { renderVideo } = require("./renderVideo");
const {createCanvas, loadImage} = require("canvas");
const {saveImage} = require("./video.utils");
const awsService = require('../src/service/aws.js');
const {
  cleanUpImage
} = require("./video.utils");
const textOnGif = require("text-on-gif");

async function generate(template) {
  const outputDir = path.join(__dirname, "../out");
  const output = path.join(__dirname, `../video/output${(new Date()).getUTCMilliseconds()}.mp4`);
  console.log(output)
  return await renderVideo({ outputDir, output },template);
}

async function generateImage(firstname) {
  const outputDir = path.join(__dirname, "../outImage");

  // Define the canvas
  const width = 600 // width of the image
  const height = 474 // height of the image
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  console.log(outputDir)
  // Define the font style
  context.textAlign = 'center'
  context.textBaseline = 'top'
  context.fillStyle = '#FFFFFF'
  context.font = "80px 'signpainter' bold";

  // Load and draw the background image first
  const image = await loadImage('./assets/endgame.jpeg')
  // Draw the background
  context.drawImage(image, 0, 0, 600, 474)

  // Draw the text
  context.fillText('Here we go', 300, 30)
  context.fillText(firstname, 300, 150)

  // Convert the Canvas to a buffer
  const fileName = await saveImage(canvas,outputDir,0)
  const url = await awsService.uploadFile(/[^/]*$/.exec(fileName)[0])
  await cleanUpImage('outImage',/[^/]*$/.exec(fileName)[0])
  return url
  // Set and send the response as a PNG
  // res.set({ 'Content-Type': 'image/png' });
  // res.send(buffer)

}

async function generateGIF(gifUrl,text){
  const writePath = path.join(__dirname, `../outGif/output_${(new Date()).getTime()}.gif`);
  //write gif as file
  await textOnGif({
    file_path:gifUrl, //path to local file or url
    textMessage:text,
    write_as_file:true,
    alignmentY:"top",
    alignmentX:"middle",
    getAsBuffer:false,
    write_path:writePath
  });
  const url = await awsService.uploadGIF(/[^/]*$/.exec(writePath)[0])
  await cleanUpImage('outGif',/[^/]*$/.exec(writePath)[0])
  return 'url'
}


module.exports = {
  generate,
  generateGIF,
  generateImage
};
