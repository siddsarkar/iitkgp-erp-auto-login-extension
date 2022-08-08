const { resolve } = require('path')
const { sync } = require('glob')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('./node_modules/terser-webpack-plugin')

const config = {
  stats: 'minimal',
  devtool: false,
  entry: {
    // content script
    content: `${__dirname}/src/content.ts`,

    // page scripts
    ...Object.fromEntries(sync('src/pages/**/*.ts').map((v) => [/(?<=src\/).+(?=[$.])/.exec(v)[0], `./${v}`]))
  },
  output: {
    path: resolve(__dirname, 'addon'),
    filename: '[name].js',
    assetModuleFilename: 'assets/images/[name][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(),

    new CopyPlugin({
      patterns: ['src/manifest.json', { from: 'src/assets', to: 'assets' }]
    }),

    ...sync('src/pages/**/*.html').map(
      (v) =>
        new HtmlWebpackPlugin({
          template: v,
          minify: {
            collapseWhitespace: false,
            removeComments: true
          },
          inject: 'body',
          scriptLoading: 'module',
          filename: /(?<=src\/).+(?=[$.])/.exec(v)[0] + '.html',
          chunks: [/(?<=src\/).+(?=[$.])/.exec(v)[0]]
        })
    ),

    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: {
            defaults: false,
            drop_console: true
          },
          output: {
            comments: false,
            beautify: true,
            indent_level: 2
          }
        }
      })
    ]
  }
}

module.exports = config
