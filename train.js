const brain = require('brain.js');
const arg = require('arg');
const fs = require('fs');

function parseArgumentsForDataConfig(rawArgs) {
    const args = arg({
        '--iterations': Number,
        '--datafile': String,
        '--modelfile': String,
        '--help': Boolean,
        '-i': '--iterations',
        '-d': '--datafile',
        '-m': '--modelfile',
        '-h': '--help'
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        iterations: args['--iterations'] || 4000,
        datafile: args['--datafile'] || 'data.json',
        modelfile: args['--modelfile'] || 'model.json',
        help: args['--help'] || false

    };
}

const agrc = parseArgumentsForDataConfig(process.argv);

console.log(argc);

if (agrc.help === true) {
    console.log('--iterations / -i -> the number of iterations to train the neural network.');
    console.log('--datafile / -d -> set the source of the data as a json file (don\'t add file extension)');
    console.log('--modelfile / -m -> set the output of the model file name (don\'t add file extension)');
} else {
    var data = fs.readFileSync(__dirname + '\\' + agrc.datafile + '.json');
    console.log(__dirname + '\\' + agrc.datafile);
    const net = new brain.recurrent.LSTM();
    data = JSON.parse(data);
    net.train(data.data, {
        iterations: agrc.iterations,
        log: details => console.log(details)
    });

    var model = net.toJSON();
    fs.writeFileSync(__dirname + '\\' + agrc.modelfile + '.json', JSON.stringify(model));
}