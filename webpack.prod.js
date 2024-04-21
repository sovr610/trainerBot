const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    target: 'node',  // Ensures built-in modules like fs aren’t polyfilled
    entry: ['./train.js', './data.json'],
    output: {
        filename: 'prod.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        })]
    },
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
