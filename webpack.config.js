const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("./node_modules/terser-webpack-plugin/dist");

const config = {
    devtool: false,
    entry: {
        background: __dirname + "/src/background.js",
        content: __dirname + "/src/content.js",
        "pages/Popup/popup": __dirname + "/src/pages/Popup/popup.js",
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: {
                        defaults: false,
                        drop_console: true,
                    },
                    output: {
                        comments: false,
                        beautify: true,
                        // eslint-disable-next-line camelcase
                        indent_level: 2,
                    },
                },
            }),
        ],
    },
};

const chromeConfig = {
    ...config,
    name: "chrome",
    output: {
        path: path.join(__dirname, "chrome"),
        filename: "[name].js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./src",
                    globOptions: {
                        ignore: ["**/*.js"],
                    },
                },
                {
                    from: "./manifests/manifest.chrome.json",
                    to: "manifest.json",
                },
            ],
        }),
    ],
};

const firefoxConfig = {
    ...config,
    name: "firefox",
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./src",
                    globOptions: {
                        ignore: ["**/*.js"],
                    },
                },
                {
                    from: "./manifests/manifest.firefox.json",
                    to: "manifest.json",
                },
            ],
        }),
    ],
    output: {
        path: path.join(__dirname, "firefox"),
        filename: "[name].js",
    },
};

module.exports = [chromeConfig, firefoxConfig];
