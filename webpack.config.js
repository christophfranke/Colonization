var path = require('path');

var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');


module.exports = {
  entry: './client/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/public')
  },
  devtool: 'inline-source-map',
  devServer: {
  	contentBase: './client/public'
  },
	module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'client/src') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
      {
        test: /\.js$/, // include .js files
        enforce: "pre", // preload the jshint loader
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        use: [
          {
            loader: "jshint-loader",
            options: { 
              emitErrors: false, 
              failOnHint: false
            } 
          }
        ]
      }
    ]
  },
 	resolve: {
    alias: {
      phaser: phaser,
      pixi: pixi,
      p2: p2,
      src: path.resolve(__dirname, 'client/src'),
      data: path.resolve(__dirname, 'client/data'),
      client: path.resolve(__dirname, 'client')
    }
	}
};
