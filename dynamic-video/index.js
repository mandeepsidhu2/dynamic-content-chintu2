const { renderVideo } = require("./renderVideo");
const path = require("path");

async function generate(template) {
  const outputDir = path.join(__dirname, "../out");
  const output = path.join(__dirname, "../video/output.mp4");

  await renderVideo({ outputDir, output },template);
  //s3Upload
  //res.s3Send
  return output;
}

module.exports = {
  generate,
};
