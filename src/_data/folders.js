const axios = require('axios');
const process = require('process');

require('dotenv').config();

module.exports = async function () {
    var cdnPath = `${process.env.CDN_PATH}/api/public/share/${process.env.CDN_SHARE_ID}`;

    let cdnResponse = await axios.get(cdnPath);
    let directories = cdnResponse.data.items.filter(e => e.isDir).map(e => e.name);
    let folders = [];

    for (let folder of directories) {
        console.log(folder);
        let cdnResponse = await axios.get(`${cdnPath}/${folder}`);

        let images = cdnResponse.data.items.map(e => e.name);

        let date = folder.split('_')[0];
        // increment day by 1
        date = new Date(date);
        date.setDate(date.getDate() + 1);
        date = date.toISOString().split('T')[0];

        let response = await axios.get(`https://commons.wikimedia.org/w/api.php?action=query&prop=images|imageinfo&iiprop=extmetadata&titles=Template:Potd/${date}&format=json&origin=*`);
        console.log(JSON.stringify(response.data));
        let pages = response.data.query.pages;
        let pageId = Object.keys(pages)[0];
        let page = pages[pageId];
        const image = page.images[0].title;
        response = await axios.get(`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${encodeURI(image)}&format=json&origin=*`);
        console.log(JSON.stringify(response.data));
        pages = response.data.query.pages;
        page = Object.values(pages)[0];
        const wikiimageurl = page.imageinfo ? page.imageinfo[0].url : null;

        folders.push({
            date: date,
            path: folder,
            thumbnail: images[images.length - 1],
            images: images,
            wikiimageurl: wikiimageurl,
            cdnurl: `${process.env.CDN_PATH}/api/public/dl/${process.env.CDN_SHARE_ID}/${folder}`,
        });

        if (folders.length >= 5) {
            break;
        }
    }

    return folders.sort((a, b) => new Date(a.date) - new Date(b.date));
};