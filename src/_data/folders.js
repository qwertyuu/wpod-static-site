const process = require('process');
const fs = require('fs');
const axios = require('axios');

require('dotenv').config();

module.exports = async function () {
    let imagesData = fs.readFileSync('images.json');
    let images = JSON.parse(imagesData);

    let folders = [];

    for (let image of images) {
        let folder = image.path;
        let date = image.date;
        let wikiimageurl = image.wikiimageurl;

        folders.push({
            date: date,
            path: folder,
            thumbnail: image.images[image.images.length - 1],
            images: image.images,
            wikiimageurl: wikiimageurl,
            cdnurl: `${process.env.CDN_PATH}/api/public/dl/${process.env.CDN_SHARE_ID}/${folder}`,
        });
    }

    return folders.sort((a, b) => new Date(a.date) - new Date(b.date));
};
