'use strict';

var path = require('path');
var webpack = require('webpack');

var entries = [
  './client/index.js' // entry point for the client app
];

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
     }
  }),
];

var config = {

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
		    presets: ["es2015", "stage-0", "react" ],
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

// Hot mode
if (process.env.NODE_ENV === 'development') {
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
