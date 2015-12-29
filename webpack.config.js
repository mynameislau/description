var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/main'
  ],
  output: {
      publicPath: '/',
      filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          plugins: ["transform-es2015-modules-commonjs"]
        }
      }
    ]
  },
  debug: true
};