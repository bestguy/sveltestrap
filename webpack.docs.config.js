/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.WEBPACK_BUILD || process.env.NODE_ENV || 'development';

const config = {
  mode: env,
  devtool: 'source-map',
  devServer: {
    inline: true,
    disableHostCheck: true,
    contentBase: './build',
    historyApiFallback: true,
    stats: {
      chunks: false
    },
    watchContentBase: true,
  },
  entry: './docs/lib/app',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./build'),
    libraryTarget: 'umd',
    // globalObject: '(typeof self !== \'undefined\' ? self : this)'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: './docs/static', to: 'assets' }, { from: './docs/index.html', to: 'index.html'} ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    // new StaticSiteGeneratorPlugin({
    //   paths,
    //   globals: {
    //     window: { },
    //   }
    // }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css',
      chunkFilename: 'assets/[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader?cacheDirectory'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.svelte$/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'svelte-loader',
        }],
      },
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.svelte'],
    alias: {
      'bootstrap-css': path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css'),
      sveltestrap: path.resolve('./src'),
    }
  }
};

module.exports = config;
