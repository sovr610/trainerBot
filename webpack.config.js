const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

module.exports = (env) => {
    if (env && env.production) {
        return merge(prodConfig, {
            // any additional production-specific configs
        });
    } else {
        return merge(devConfig, {
            // any additional development-specific configs
        });
    }
};
