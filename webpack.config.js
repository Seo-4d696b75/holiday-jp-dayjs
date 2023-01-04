const path = require("path");

module.exports = {
  entry: './src/index.ts',
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "umd"),
    filename: "holiday-jp-dayjs.min.js",
    library: 'holiday-jp-dayjs',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader'
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  }
};