const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", `./client/src/index.jsx`],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./client/dist"),
    publicPath: 'https://pangea.stanford.edu/sgp-search/'
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "Production"
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["env", "react"],
            plugins: ["transform-object-rest-spread"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
