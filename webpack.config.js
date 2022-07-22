const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("./node_modules/terser-webpack-plugin/dist");

const config = {
    devtool: false,
    stats: "minimal",
    entry: {
        background: __dirname + "/src/background.js",
        content: __dirname + "/src/content.js",

        // pages
        ...Object.fromEntries(
            glob.sync("src/pages/**/*.js").map((v) => [/(?<=src\/).+(?=[$.])/.exec(v)[0], `./${v}`])
        ),
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
                        indent_level: 2,
                    },
                },
            }),
        ],
    },
};

const copyPatterns = [
    {
        from: "./src",
        globOptions: {
            ignore: ["**/*.js"],
        },
    },
];

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
                ...copyPatterns,
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
                ...copyPatterns,
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
