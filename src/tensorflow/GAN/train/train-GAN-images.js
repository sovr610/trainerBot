const tf = require('@tensorflow/tfjs-node-gpu');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function loadImages(dataDir, imgWidth, imgHeight) {
    const files = glob.sync(`${dataDir}/*.jpg`); // Adjust pattern to match your data
    const tensors = files.map(file => {
        const buffer = fs.readFileSync(file);
        const img = tf.node.decodeImage(buffer, 3);
        return img.resizeNearestNeighbor([imgWidth, imgHeight]).toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
    });
    return tf.stack(tensors);
}

// Define the generator
function createGenerator() {
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [100], units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: 784, activation: 'tanh'})); // Example for 28x28 pixel output
    return model;
}

// Define the discriminator
function createDiscriminator() {
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [784], units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    model.compile({
        optimizer: tf.train.adam(0.0002),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}

// Create and compile the GAN (combined model)
function createGAN(generator, discriminator) {
    discriminator.trainable = false; // Freeze the discriminator during generator training
    const model = tf.model({
        inputs: generator.inputs,
        outputs: discriminator(generator.outputs)
    });
    model.compile({
        optimizer: tf.train.adam(0.0002),
        loss: 'binaryCrossentropy'
    });
    return model;
}

async function trainGAN(generator, discriminator, gan, epochs, batchSize, dataset) {
    const datasetSize = dataset.shape[0];
    const stepsPerEpoch = Math.floor(datasetSize / batchSize);

    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let step = 0; step < stepsPerEpoch; step++) {
            const batchStart = step * batchSize;
            const batchEnd = batchStart + batchSize;
            const realData = dataset.slice(batchStart, batchEnd);

            // Generate noise
            const inputNoise = tf.randomNormal([batchSize, 100]);
            const generatedData = generator.predict(inputNoise);
            
            // Prepare labels for real and fake data
            const realLabels = tf.ones([batchSize, 1]);
            const fakeLabels = tf.zeros([batchSize, 1]);

            // Train discriminator
            const dLossReal = discriminator.trainOnBatch(realData, realLabels);
            const dLossFake = discriminator.trainOnBatch(generatedData, fakeLabels);

            // Train generator
            const gLoss = gan.trainOnBatch(inputNoise, realLabels);

            console.log(`Epoch ${epoch + 1}/${epochs}, Step ${step + 1}/${stepsPerEpoch}, Discriminator Loss: ${(dLossReal + dLossFake) / 2}, Generator Loss: ${gLoss}`);
        }
    }
}

async function saveModel(model, filePath) {
    await model.save(`file://${filePath}`);
}

async function main() {
    const generator = createGenerator();
    const discriminator = createDiscriminator();
    const gan = createGAN(generator, discriminator);

    const dataDir = 'path/to/your/dataset';
    const imgWidth = 28;
    const imgHeight = 28;
    const dataset = await loadImages(dataDir, imgWidth, imgHeight);

    const epochs = 50;
    const batchSize = 64;
    await trainGAN(generator, discriminator, gan, epochs, batchSize, dataset);

    // Save models
    await generator.save('file://./generator');
    await discriminator.save('file://./discriminator');
}
main().then(() => console.log('Training completed and models saved.'));


