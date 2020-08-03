const path = require('path');
const { DefinePlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
const PhaserInput = path.join(__dirname, '/lib/@azerion/phaser-input/build/phaser-input.js');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/app.ts')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new DefinePlugin({
      WS_SERVER: process.env.WS_SERVER
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'head',
      filename: 'index.html',
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    },
    minimizer: [new UglifyJsPlugin()],
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /\.js?$/, loader: 'eslint-loader', exclude: '/node_modules/' },
      { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
      { test: /phaser\.js/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /phaser\-input\.js/, loader: 'expose-loader?PhaserInput', options: { exposes: ['PhaserInput'] }  },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      'phaser-ce': phaser,
      'pixi': pixi,
      'p2': p2,
      'phaser-input': PhaserInput
    }
  }
};
