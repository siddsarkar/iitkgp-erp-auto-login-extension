const path = require("path");

module.exports = {
  devtool: false,
  entry: {
    background: "./src/background.js",
    content: "./src/content.js",
    popup: "./src/scripts/popup.js",
  },
  output: {
    filename: "build/js/[name].js",
    path: path.resolve(__dirname, "addon"),
  },
};
