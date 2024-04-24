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
      iterations: args['--iterations'] || 500,
      modelfile: args['--modelfile'] || 'model',
      help: args['--help'] || false,
    };
  }
  
  
  
  const argc = parseArgumentsForDataConfig(process.argv);
  console.log(argc);