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
        b. `--datafile`: The input data file name (the directoory is the same as where tou run the train.js).
        
4. A good example to train a model with trainerBot is: `node train.js --iterations 5000 --modelfile model_one`
    - This will get the data file `./data.json` and train the model `5000` times and output the model to `./model_one.json`.

5. congrats! you have a brain.js model saved in a file for later use.


# Future goals

- [ ] Add other neural networks other than the recurrent.LSTM neural network.
~~ optimize Javascript code with google cloosure compiler (started but not finished).~~
- [x] optimize the javascript project with webpack.
- [x] integrate nexe to deploy an executable to run the trainerbot. 
- [ ] Have the optioon to use clusters to have parallel multiple neural network models being made at once.
- [ ] Have a verification process to test the model.
