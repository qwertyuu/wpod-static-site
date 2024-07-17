module.exports = function (eleventyConfig) {
    // Copy the images to the output folder
    eleventyConfig.addPassthroughCopy("images");

    return {
        dir: {
            input: "src",
            output: "dist"
        }
    };
};