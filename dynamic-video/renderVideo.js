// const { default: Konva } = require("konva");
const Konva = require("konva");

const { videoWidth, videoHeight, videoFps } = require("./consts");
const {
  saveFrame,
  createVideo,
  loadImageAsset,
  makeAnimation,
  cleanUp,
  combineAnimations,
} = require("./video.utils");
const awsService = require('../src/service/aws.js');
function renderBackground(layer,bg) {
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: videoWidth,
      height: videoWidth,
      fill: bg,
    })
  );
}

function renderText(layer,texts) {
  const children = [];
  texts.forEach(t=>{
   const el = new Konva.Text(t);
   children.push(el)
  });

  layer.add(...children);
  return combineAnimations(
    makeAnimation((d) => children[0].x((d - 1) * videoWidth), {
      startFrame: 0,
      duration: 2 * videoFps,
    }),
    makeAnimation((d) => children[1].x((1 - d) * videoWidth), {
      startFrame: 1 * videoFps,
      duration: 2 * videoFps,
    }),
    makeAnimation((d) => children[2].opacity(d), {
      startFrame: 2.5 * videoFps,
      duration: 1 * videoFps,
    })
  );
}

async function renderLogo(layer) {
  const image = await loadImageAsset("logo.png");
  const aspect = image.width() / image.height();
  image.width(aspect * 100);
  image.height(100);
  image.y(videoHeight - 100 - 50);
  image.x(videoWidth - image.width() - 75);
  image.cache();
  image.opacity(0);

  layer.add(image);

  return makeAnimation((d) => image.opacity(d), {
    startFrame: 3 * videoFps,
    duration: 1 * videoFps,
  });
}

async function renderVideo({ outputDir, output },template) {
  const stage = new Konva.Stage({
    width: videoWidth,
    height: videoHeight,
  });
  const start = Date.now();
  const frames = 5 * videoFps;
  try {
    const layer = new Konva.Layer();
    stage.add(layer);

    const animate = combineAnimations(
      renderBackground(layer,template.bg),
      renderText(layer,template.texts),
      await renderLogo(layer)
    );

    console.log("generating frames...");
    for (let frame = 0; frame < frames; ++frame) {
      animate(frame);
      layer.draw();
      try {
        await saveFrame({stage, outputDir, frame});
      }catch (e){
        console.log(e)
      }
      if ((frame + 1) % videoFps === 0) {
        console.log(`rendered ${(frame + 1) / videoFps} second(s)`);
      }
    }
  } finally {
    stage.destroy();
  }

  console.log("creating video");
  await createVideo({ fps: videoFps, outputDir, output });
  await awsService.uploadVideo()
  await cleanUp(outputDir)
  const time = Date.now() - start;
  console.log(`done in ${time} ms. ${(frames * 1000) / (time || 0.01)} FPS`);
}

module.exports = {
  renderVideo,
};
