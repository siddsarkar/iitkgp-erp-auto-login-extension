const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        background: './src/js/background.js',
        content: './src/js/content.js',
        popup: './src/js/popup.js'
    },
    output: {
        path: path.join(__dirname, 'addon'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src/',
                    globOptions: {
                        ignore: ['**/*.scss', '**/js/**']
                    }
                }
            ]
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: false,
                    output: {
                        beautify: true,
                        indent_level: 2
                    }
                }
            })
        ]
    }
}
