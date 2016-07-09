const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'static');
var APP_DIR = path.resolve(__dirname, 'src/');

const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?indentedSyntax=scss&includePaths[]=' + APP_DIR
];

var config = {
    entry: [
        'babel-polyfill',
        './src/index'
    ],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: './static/'
    },
    module : {
        loaders: [ //добавили babel-loader
            {
                loaders: ['babel-loader'],
                include: [
                    path.resolve(__dirname, "src")
                ],
                test: /\.js$/,
                plugins: ['transform-runtime']
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.css$/,
                loaders: ["style", "css"]
            },
            { test: /\.(png|jpg|svg)$/, loader: 'file-loader' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    resolve: {
        extensions: ['', '.js', '.scss'],
        root: [APP_DIR]
    }
};

module.exports = config;
