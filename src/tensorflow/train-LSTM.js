const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const cliProgress = require('cli-progress');
const dataJson = require('../data.json');

class TensorFlowTrainer {
  constructor(iterations = 500, modelfile = 'model', help = false) {
    this.iterations = iterations;
    this.modelfile = modelfile;
    this.help = help;
    this.progressBar = new cliProgress.SingleBar({
      format: 'Progress [{bar}] {percentage}% | {value}/{total} Iterations | ETA: {eta_formatted} | Error: {customText}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    }, cliProgress.Presets.shades_classic);

    this.model = tf.sequential();
    this.model.add(tf.layers.lstm({
      units: 35,
      inputShape: [dataJson.sequenceLength, dataJson.inputSize],
      returnSequences: true
    }));
    this.model.add(tf.layers.dense({ units: 15 }));
    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async trainModel() {
    if (dataJson.data == null) {
      console.log('Please supply a data file to train the neural network named: data.json.');
      return;
    }

    if (this.help) {
      console.log('--iterations / -i -> the number of iterations to train the neural network.');
      console.log("--modelfile / -m -> set the output of the model file name (don't add file extension)");
      return;
    }

    const inputs = tf.tensor3d(dataJson.data.map(item => item.input));
    const labels = tf.tensor2d(dataJson.data.map(item => item.output));

    this.progressBar.start(this.iterations, 0, {
      customText: 'N/A'
    });

    await this.model.fit(inputs, labels, {
      epochs: this.iterations,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.progressBar.update(epoch + 1, {
            customText: logs.loss.toFixed(4)
          });
        }
      }
    });

    this.progressBar.stop();
    const savedModelPath = `${__dirname}\\${this.modelfile}.json`;
    await this.model.save(`file://${savedModelPath}`);
  }
}