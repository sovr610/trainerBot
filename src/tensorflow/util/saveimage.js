/**
 * Saves generated images from tensor data to a specified path.
 * @param {tf.Tensor} data - The tensor containing image data.
 * @param {string} path - The path to save the image file.
 */
async function saveGeneratedImages(data, path) {
    // Assuming data tensor shape is [batchSize, height * width], and each pixel is between -1 and 1
    // Normalize pixel values to be between 0 and 255
    const [batchSize, imageSize] = data.shape;
    const width = Math.sqrt(imageSize); // Assuming images are square
    if (width % 1 !== 0) {
        throw new Error('Image data must form a square');
    }
    
    // Convert the tensor into an array of pixel values
    const dataBuffer = await data.mul(127.5).add(127.5).toInt().data();
    
    // Each image in the batch
    for (let i = 0; i < batchSize; i++) {
        // Create a buffer for each image and use sharp to save it
        const singleImageBuffer = Buffer.from(dataBuffer.slice(i * imageSize, (i + 1) * imageSize));
        await sharp(singleImageBuffer, {
            raw: {
                width: width,
                height: width,
                channels: 1 // Grayscale image. For RGB, this needs to be 3
            }
        })
        .toFormat('png') // Convert to PNG
        .toFile(`${path}-${i}.png`); // Save to file with index
    }
}