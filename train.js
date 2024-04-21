const brain = require('brain.js');
const arg = require('arg');
const fsObj = require('fs');
const cliProgress = require('cli-progress');
const data = require('./data.json');

/**
 * Parses the arguments given to the program and returns an object with the values
 * @param {String[]} rawArgs - The arguments to give to the program
 * @function parseArgumentsForDataConfig
 * @returns object of arguments processes to access each value with ease and preset values if not given
 */
function parseArgumentsForDataConfig(rawArgs) {
  const args = arg(
    {
      '--iterations': Number,
      '--datafile': String,
      '--modelfile': String,
      '--help': Boolean,
      '-i': '--iterations',
      '-d': '--datafile',
      '-m': '--modelfile',
      '-h': '--help',
    },
    {
      argv: rawArgs.slice(2),
    },
  );
  return {
    iterations: args['--iterations'] || 4000,
    modelfile: args['--modelfile'] || 'model',
    help: args['--help'] || false,
  };
}



const argc = parseArgumentsForDataConfig(process.argv);
console.log(argc);

const progressBar = new cliProgress.SingleBar({
    format: 'Progress [{bar}] {percentage}% | {value}/{total} Iterations | ETA: {eta_formatted} | Training Neural Networ Model',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
}, cliProgress.Presets.shades_classic);
progressBar.start(argc.iterations, 0);
if (data == null) {
  console.log(
    'Please supply a data file to train the neural network named: data.json.',
  );
} else if (argc.help === true) {
  console.log(
    '--iterations / -i -> the number of iterations to train the neural network.',
  );
  console.log(
    "--modelfile / -m -> set the output of the model file name (don't add file extension)",
  );
} else {
  const net = new brain.recurrent.LSTM({
    hiddenLayers: [20, 20],
    learningRate: 0.01,
    decayRate: 0.999,
    errorThresh: 0.005,
  });
  
  net.train(data.data, {
    iterations: argc.iterations,
    log: true,
    logPeriod: 100,
    layers: [10, 20, 10],
    errorThresh: 0.001,
    callbackPeriod: 1,
    callback: (state) => {
        console.clear(); 
        const progress = state.iterations; // Convert iteration count to progress percentage
        progressBar.update(progress);
      },
  });

  const model = net.toJSON();
  fsObj.writeFileSync(
    `${__dirname}\\${argc.modelfile}.json`,
    JSON.stringify(model),
  );

  progressBar.stop();
}
