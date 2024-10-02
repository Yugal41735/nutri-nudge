// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/background.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'background.bundle.js'
  },
  resolve: {
    fallback: {
      "fs": false,       // Browser does not need access to the file system module
      "path": false      // No need for 'path' in browser environment
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Convert newer JS syntax into compatible JS
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
