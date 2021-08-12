const path = require("path");
const { renderVideo } = require("./renderVideo");
const {createCanvas, loadImage} = require("canvas");
const {saveImage} = require("./video.utils");
const awsService = require('../src/service/aws.js');
const {
  cleanUpImage
} = require("./video.utils");

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


module.exports = {
  generate,
  generateImage
};
