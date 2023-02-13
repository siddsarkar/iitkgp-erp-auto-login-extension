const path = require('node:path')
const sync = require('glob').sync
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = {
  entry: {
    /* generate content entry */
    content: `${__dirname}/src/content.ts`,

    /* generate entries for all subfolders in src/pages directory */
    ...Object.fromEntries(sync('src/pages/**/*.ts').map((v) => [/(?<=src\/).+(?=[$.])/.exec(v)[0], `./${v}`]))
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'addon')
  },
  plugins: [
    /* copy public folder to addon folder */
    new CopyPlugin({
      patterns: ['src/manifest.json', { from: 'src/assets', to: 'assets' }]
    })
  ]
}

const dev = {
  ...common,
  stats: 'minimal',
  name: 'dev',
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      ...common.module.rules,
      {
        // use tailwindcss with postcss
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 1 => postcss-loader
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,

    /* generate html files for all subfolders in src/pages directory */
    ...sync('src/pages/**/*.html').map(
      (v) =>
        new HtmlWebpackPlugin({
          template: v,
          inject: 'head',
          scriptLoading: 'module',
          filename: /(?<=src\/).+(?=[$.])/.exec(v)[0] + '.html',
          chunks: [/(?<=src\/).+(?=[$.])/.exec(v)[0]]
        })
    )
  ]
}

const prod = {
  ...common,
  name: 'prod',
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      ...common.module.rules,
      {
        // use tailwindcss with postcss
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 1 => postcss-loader
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,

    /* generate html files for all subfolders in src/pages directory */
    ...sync('src/pages/**/*.html').map(
      (v) =>
        new HtmlWebpackPlugin({
          template: v,
          inject: 'head',
          scriptLoading: 'module',
          filename: /(?<=src\/).+(?=[$.])/.exec(v)[0] + '.html',
          chunks: [/(?<=src\/).+(?=[$.])/.exec(v)[0]],
          minify: {
            collapseWhitespace: false,
            removeComments: true
          }
        })
    ),

    /* extract css to a separate file */
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimize: true,
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

module.exports = [dev, prod]
