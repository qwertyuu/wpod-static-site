const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = function () {
    const imageRoot = './images/';
    const folders = fs.readdirSync(imageRoot)
        .filter(file => fs.statSync(path.join(imageRoot, file)).isDirectory())
        .map(async folder => {
            const images = fs.readdirSync(path.join(imageRoot, folder))
                .filter(file => file.endsWith('.png'))
                .sort((a, b) => parseInt(a) - parseInt(b));

            let date = folder.split('_')[0];
            // increment day by 1
            date = new Date(date);
            date.setDate(date.getDate() + 1);
            date = date.toISOString().split('T')[0];

            let response = await axios.get(`https://commons.wikimedia.org/w/api.php?action=query&prop=images|imageinfo&iiprop=extmetadata&titles=Template:Potd/${date}&format=json&origin=*`)
            let pages = response.data.query.pages;
            let pageId = Object.keys(pages)[0];
            let page = pages[pageId];
            const image = page.images[0].title;
            response = await axios.get(`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${image}&format=json&origin=*`)
            pages = response.data.query.pages;
            pageId = Object.keys(pages)[0];
            page = pages[pageId];
            const wikiimageurl = page.imageinfo[0].url;

            return {
                date: date,
                path: folder,
                thumbnail: images[images.length - 1],
                images: images,
                wikiimageurl: wikiimageurl,
            };
        });

    return Promise.all(folders).then(folders => {
        return folders.sort((a, b) => new Date(a.date) - new Date(b.date));
    });
};