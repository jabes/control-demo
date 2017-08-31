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
        test: /\.(jpg|png|gif|svg|eot|woff|ttf)$/i,
        use: [{
          loader: 'url-loader', // Loads files as `base64` encoded URL
          options: {
            limit: 8192
          },
        }],
      }
    ],
  },

  plugins: [],

};

if (env === 'production') {
  config.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
} else if (env === 'development') {
  config.entry.push('webpack-hot-middleware/client');
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = config;
