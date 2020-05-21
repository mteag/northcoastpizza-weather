const webpack = require('webpack');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
	loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
}
