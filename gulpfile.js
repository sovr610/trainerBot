const gulp = require('gulp');
const {src,dest} = require('gulp');
const closure = require('google-closure-compiler').gulp({
    extraArguments: ['-Xms2048m']
});

function compile(){
    return gulp.src('./train.js', {
        base: './'
    })
    .pipe(closure({
        compilation_level: "SIMPLE",
        warning_level: 'VERBOSE',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT6_STRICT',
        output_wrapper: '(function(){\n%output%\n}).call(this)',
        js_output_file: 'output.min.js'
    }))
    .pipe(gulp.dest('./build/'));
}

module.exports.compile = compile;

