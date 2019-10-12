const buildConfig = require('./build.config');
const path = require('path');
const fs_extra = require('fs-extra');
const remove_dir = require('delete');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserAsyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// TODO: Check if there will be a problems with deploying the bundle made from webpack to the Messenger games.
// Phaser webpack config.
let phaserModule = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(phaserModule, 'src/phaser.js');

let gameDir = `${buildConfig.gameDir}/${buildConfig.gameName}`;

remove_dir.sync('./dist');

const copyFilesAndDirectory = (src, dest) => {
  console.log(">>>>src---" + src, dest);
  fs_extra.copySync(src, dest);
};

let toCopy = [{
    from: `${gameDir}/assets/audio`,
    to: './dist/assets/audio'
  },
  {
    from: `${gameDir}/assets/images`,
    to: './dist/assets/images'
  },
  {
    from: `${gameDir}/assets/bitmapfonts`,
    to: './dist/assets/bitmapfonts'
  },
  {
    from: `${gameDir}/assets/json`,
    to: './dist/assets/json'
  },
  {
    from: `${gameDir}/assets/spritesheets`,
    to: './dist/assets/spritesheets'
  },
  {
    from: `${gameDir}/js/plugins`,
    to: './dist/plugins'
  },
];

// Iterate through files to copy and copy them.
for (let i = 0; i < toCopy.length; i++) {
  copyFilesAndDirectory(toCopy[i].from, toCopy[i].to);
}

module.exports = {
  mode: buildConfig.mode, // Set up a config mode.
  // Entry files settings.
  entry: {
    app: [`${gameDir}/js/game.js`],
    vendor: [phaser]

  },
  // Output settings.
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  watch: true, // Enable hot preloading in the browser.
  plugins: [
    // Define plugins.
    new HtmlWebpackPlugin({
      filename: '../dist/index.html',
      template: `./index.html`,
      chunks: ['vendor', 'app'],
    }),
    new BrowserAsyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./dist']
      }
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      include: path.join(__dirname, 'src')
    }, ]
  },
  // Optimization settings.
  optimization: {
    minimize: true,
    minimizer: [
      // Define a plugin.
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          output: {
            comments: buildConfig.terserOutput.comments,
            quote_keys: buildConfig.terserOutput.quote_keys,
            keep_quoted_props: buildConfig.terserOutput.keep_quoted_props,
          },
          mangle: {
            keep_fnames: buildConfig.mangle.keep_fnames,
            keep_classnames: buildConfig.mangle.keep_classnames,
            toplevel: buildConfig.mangle.toplevel,
            safari10: buildConfig.mangle.safari10,
          },
          compress: {
            arguments: buildConfig.compress.arguments,
            collapse_vars: buildConfig.compress.collapse_vars,
            conditionals: buildConfig.compress.conditionals,
            arrows: buildConfig.compress.arrows,
            unsafe_arrows: buildConfig.compress.unsafe_arrows,
            loops: buildConfig.compress.loops,
            toplevel: buildConfig.compress.toplevel,
            reduce_funcs: buildConfig.compress.reduce_funcs,
            reduce_vars: buildConfig.compress.reduce_vars,
            join_vars: buildConfig.compress.join_vars,
            drop_console: buildConfig.compress.drop_console
          },
        },
      }),
    ],
  },
};