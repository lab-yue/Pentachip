const path = require("path")
module.exports = {
    entry: "./src/ts/index.ts",
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