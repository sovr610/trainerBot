const brain = require('brain.js');
const fsObj = require('fs');
const cliProgress = require('cli-progress');
const data = require('../data.json');

class NeuralNetworkTrainer {
  constructor(iterations = 500, modelfile = 'model', help = false) {
    this.iterations = iterations;
    this.modelfile = modelfile;
    this.help = help;
    this.progressBar = new cliProgress.SingleBar({
      format: 'Progress [{bar}] {percentage}% | {value}/{total} Iterations | ETA: {eta_formatted} | {customText}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    }, cliProgress.Presets.shades_classic);
  }

  displayHelp() {
    console.log(
      '--iterations / -i -> the number of iterations to train the neural network.',
    );
    console.log(
      "--modelfile / -m -> set the output of the model file name (don't add file extension)",
    );
  }

  trainNetwork() {
    if (data == null) {
      console.log(
        'Please supply a data file to train the neural network named: data.json.',
      );
    } else if (this.help) {
      this.displayHelp();
    } else {
      const net = new brain.recurrent.LSTM({
        hiddenLayers: [15, 35, 15],
        learningRate: 0.01,
        decayRate: 0.999,
        errorThresh: 0.005,
        regularization: { type: 'L2', lambda: 0.01 },
      });

      this.progressBar.start(this.iterations, 0);
      net.train(data.data, {
        iterations: this.iterations,
        log: true,
        logPeriod: 100,
        regularization: { type: 'L2', lambda: 0.01 },
        layers: [15, 35, 15],
        errorThresh: 0.001,
        callbackPeriod: 1,
        callback: (state) => {
          console.clear();
          this.progressBar.update(state.iterations, {
            customText: `Error: ${state.error.toFixed(4)}`
          });
        },
      });

      const model = net.toJSON();
      fsObj.writeFileSync(
        `${__dirname}\\${this.modelfile}.json`,
        JSON.stringify(model),
      );

      this.progressBar.stop();
    }
  }
}
