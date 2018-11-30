module.exports = {
  entry: `${__dirname}/client/src/index.jsx`,
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
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
