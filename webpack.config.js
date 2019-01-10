module.exports = {
  entry: ["babel-polyfill", `${__dirname}/client/src/index.jsx`],
  output: {
    filename: "bundle.js",
    path: `${__dirname}/client/dist`
  },
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
      },
      {
        test: /\.mp4$/,
        loader: "url-loader?limit=10000&mimetype=video/mp4"
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]
  }
};
