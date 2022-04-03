# trainerBot
The ability to train a LSTM neural network that runs brain.js and saves the model inn a json file for future use in the browser.

# How to Start-Up

1. perform the `npm install` in the root project folder to install dependencies.
2. collect data to put into a `.json` format file. The schema has to match:
        `{
          "data:[{
              "input":"hey",
              "output":"howdy"
              },....
           ]
         }`
3. run `node train.js -h` to print out the arguments you can use to train the model.
    - Arguments:
        a. `--iterations`: the number of iterations to cycle through when training model (higher the better, but takes longer).
        b. `--modelfile`: The output model file name (the output directory is where you run the train.js file).
        c. `--datafile`: The input data file name (the directoory is the same as where tou run the train.js).
        
4. A good example to train a model with trainerBot is: `node train.js --iterations 5000 --datafile data_one --modelfile model_one`
    - This will get the data file `./data_one.json` and train the model `5000` times and output the model to `./model_one.json`.

5. congrats! you have a brain.js model saved in a file for later use.


# Future goals

1. Add other neural networks other than the recurrent.LSTM neural network.
2. optimize Javascript code with google cloosure compiler (started but not finished).
3. Have the optioon to use clusters to have parallel multiple neural network models being made at once.
4. Have a verification process to test the model.
