const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Assume createGenerator and textToEmbedding are defined
const generator = createGenerator();  // Load your pre-trained generator model
const gloveModel = loadGloVeModel('glove.6B.50d.txt');  // Make sure you point to the correct path

function loadGloVeModel(filePath) {
    const gloveVectors = {};
    const data = fs.readFileSync(filePath, 'utf-8');
    data.split('\n').forEach(line => {
        const parts = line.split(' ');
        const word = parts[0];
        const vector = parts.slice(1).map(parseFloat);
        gloveVectors[word] = vector;
    });
    return gloveVectors;
}

function textToEmbedding(text, gloveModel) {
    const words = text.toLowerCase().split(' ');
    let sumVector = Array(gloveModel[Object.keys(gloveModel)[0]].length).fill(0);
    let wordCount = 0;

    words.forEach(word => {
        if (gloveModel[word]) {
            sumVector = sumVector.map((val, idx) => val + gloveModel[word][idx]);
            wordCount++;
        }
    });

    if (wordCount > 0) {
        sumVector = sumVector.map(val => val / wordCount);
    }

    return tf.tensor2d([sumVector]); // Wrap in a batch dimension
}

async function generateImageFromText(prompt) {
    const textEmbedding = textToEmbedding(prompt, gloveModel);

    // Generate an image tensor using the generator
    const imageTensor = generator.predict(textEmbedding);

    // Convert the tensor to an image data
    const [width, height] = [256, 256];  // Assume 256x256 images
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    // Convert the tensor to pixel data (assuming imageTensor is scaled [0, 1])
    const data = await imageTensor.mul(255).toInt().data();  // Convert to uint8
    for (let i = 0; i < data.length; i++) {
        imageData.data[i] = data[i];
    }
    ctx.putImageData(imageData, 0, 0);

    // Save the canvas to a PNG file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('generated_image.png', buffer);
    console.log('Image generated and saved as "generated_image.png".');
}

generateImageFromText('A beautiful sunset over the ocean');  // Example prompt
