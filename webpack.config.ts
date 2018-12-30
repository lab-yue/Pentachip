const path = require("path")
module.exports = {
    entry: "./src/ts/index.ts",
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
      },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist/js')
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader"
        }]
    }
}