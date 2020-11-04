const PImage = require("pureimage");
const PngJs = require("pngjs");

export const colorToBase64String = (
  color: string,
  width: number,
  height: number
) => {
  const img = PImage.make(width, height);

  const context = img.getContext("2d");

  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  const imgData = context.getImageData();
  const imgPng = new PngJs.PNG({ width, height });

  imgPng.data = Buffer.from(imgData.data);

  const packedStream = imgPng.pack();

  let chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    packedStream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    packedStream.on("error", (e: Error) => {
      console.error(e);
      reject(e);
    });

    packedStream.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve(result.toString("base64"));
    });
  });
};
