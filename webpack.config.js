const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV;

let config = {

  entry: [
    './src/app.js',
  ],

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'eslint-loader', enforce: 'pre'},
      {test: /\.js$/, loader: 'babel-loader'},
      {test: /\.css$/, loaders: ['style-loader', 'css-loader', 'postcss-loader']},
      {test: /\.styl$/, loaders: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']},
      {test: /\.vue$/, loader: 'vue-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.(jpg|png|gif)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          },
        }],
      }
    ],
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ],

};

if (env !== 'production') {
  config.entry.push('webpack-hot-middleware/client');
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = config;
