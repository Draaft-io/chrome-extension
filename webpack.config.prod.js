const path = require("path")
const webpack = require("webpack")
const fs = require("fs")
const trash = require("trash")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [ "env", "react" ],
          },
        },
      }, {
        test: /\.less$/,
        use: [{
          loader: "style-loader",
        }, {
          loader: "css-loader",
        }, {
          loader: "less-loader",
          options: {
            strictMath: true,
            noIeCompat: true,
          },
        }],
      }, {
        test: /\.css$/,
        use: [{
          loader: "skeleton-loader",
          options: {
            procedure(content) {
              const fileName = `${this._module.userRequest}.json`
              const classNames = fs.readFileSync(fileName, "utf8")

              trash(fileName)

              return [ "module.exports = {",
                `classNames: ${classNames},`,
                `stylesheet: \`${content}\``,
                "}",
              ].join("")
            },
          },
        },
        "postcss-loader",
        "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
}
