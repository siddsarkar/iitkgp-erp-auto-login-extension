const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('./node_modules/terser-webpack-plugin/dist');

module.exports = [
	{
		name: 'firefox',
		devtool: false,
		entry: {
			background: __dirname + '/src/background.js',
		},
		output: {
			path: path.join(__dirname, 'firefox'),
			filename: '[name].js',
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{
						from: './src',
					},
					{
						from: './manifests/manifest.firefox.json',
						to: 'manifest.json',
					},
				],
			}),
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						mangle: false,
						compress: false,
						output: {
							beautify: true,
							// eslint-disable-next-line camelcase
							indent_level: 2,
						},
					},
				}),
			],
		},
	},
	{
		name: 'chrome',
		devtool: false,
		entry: {
			background: __dirname + '/src/background.js',
		},
		output: {
			path: path.join(__dirname, 'chrome'),
			filename: '[name].js',
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{
						from: './src',
					},
					{
						from: './manifests/manifest.chrome.json',
						to: 'manifest.json',
					},
				],
			}),
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						mangle: false,
						compress: false,
						output: {
							beautify: true,
							// eslint-disable-next-line camelcase
							indent_level: 2,
						},
					},
				}),
			],
		},
	},
];
