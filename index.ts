const sharp = require("sharp");
const axios = require("axios");

async function createImageWithWatermark() {
    try {
        const dataImage = await axios({
            url: `https://thumbs.dreamstime.com/b/example-red-tag-example-red-square-price-tag-117502755.jpg`,
            method: 'GET',
            responseType: 'arraybuffer',
        })
        const image = dataImage?.data
        const imageInfo = await sharp(image).metadata(); //get info of image
        const resizeTransparent = await sharp("public/images/transparent.png") // resize image transparent
            .resize({
                width: imageInfo.width,
                height: imageInfo.height
            }).toBuffer()
        const resizeLogo = await sharp("public/images/logo.png")  // resize logo
            .resize({
                width: 80,
                height: 40
            }).toBuffer()
        await sharp(image) // convert image with watermark
            .composite([
                {
                    input: resizeTransparent,
                },
                {
                    input: resizeLogo,
                    gravity: 'southeast',
                    top: imageInfo.height - 50,
                    left: imageInfo.width - 100,
                },
            ])
            .toFile("public/images/final-image.png");
        console.log("create done")
    } catch (error) {
        console.log(`An error occurred during processing: ${error}`);
    }
}

createImageWithWatermark();
