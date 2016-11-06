'use strict';

var path = require('path');
var webpack = require('webpack');

var entries = [
'./client/index.js' // entry point for the client app
]

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin()
]

if(process.env.NODE_ENV === 'development') {
  entries.push('webpack-hot-middleware/client')
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {

  devtool: '#inline-source-map',

  entry: entries,

  output: {
	path: path.join(__dirname, 'build'),
	filename: 'bundle.js',
	publicPath: '/static/'
  },

  //
  plugins: plugins,

  //
  resolve: {
	alias: {
	},
	// require() file without adding .jsx and .js .suffix
	extensions: ['', '.js', '.jsx']
  },

  // be sure to add 'stage-0' in .babelrc to support es7 syntax
  module: {
	loaders: [
		{
		  test: /\.jsx?$/,
		  loader: 'babel',
		  exclude: /node_modules/,
		  include: __dirname,
		  query: {
		    presets: [ 'react-hmre', "es2015", "stage-0", "react" ],
		    plugins: [ "transform-decorators-legacy" ],
		  }
		},
		{
		  test: /\.css$/,
		  loader: "style!css",
		},
	]
  }
};
