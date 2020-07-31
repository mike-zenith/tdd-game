const path = require('path');
const { DefinePlugin } = require('webpack');

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
const PhaserInput = path.join(__dirname, '/lib/@azerion/phaser-input/build/phaser-input.js');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, 'src/app.ts')
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
    }
  },
  plugins: [
    new ESLintPlugin({
      files: ['./src/**/*.ts']
    }),
    new DefinePlugin({
      WS_SERVER: process.env.WS_SERVER || "http://0.0.0.0:3000"
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'head',
      filename: 'index.html',
    })
  ],
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /\.js?$/, loader: 'eslint-loader', exclude: '/node_modules/' },
      { test: /phaser\.js/, loader: 'expose-loader?Phaser', options: { exposes: ['Phaser'] }  },
      { test: /pixi\.js/, loader: 'expose-loader?PIXI', options: { exposes: ['PIXI'] }  },
      { test: /p2\.js/, loader: 'expose-loader?p2', options: { exposes: ['p2'] }  },
      { test: /phaser\-input\.js/, loader: 'expose-loader?PhaserInput', options: { exposes: ['PhaserInput'] }  },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'phaser-input': PhaserInput
    }
  },
  devServer: {
    publicPath: '/',
    contentBase: path.join(__dirname, 'public'),
    port: 8000,
    disableHostCheck: true,
  }
};
