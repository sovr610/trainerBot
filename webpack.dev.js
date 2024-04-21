const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'node',  // Important: this specifies that the bundle is for Node.js
    entry: ['./train.js','./data.json'],
    output: {
        filename: 'dev.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'data.json', to: 'data.json' }
            ]
        })
    ],
    externals: {
        'gl': 'commonjs gl'  // Tells Webpack not to bundle 'gl'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /data\.json$/,
                type: 'javascript/auto',
                use: {
                    loader: 'json-loader'
                }
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            },
        ]
    },
    resolve: {
        fullySpecified: false // to fix node module resolution
    }
};
