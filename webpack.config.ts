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
        modules: ["src", "node_modules"],
        extensions: [".ts"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader"
        }, {
            test: /\.scss$/,
            use: [
                {
                    loader: "sass-loader",
                    options: {
                        includePaths: ["src/scss"]
                    }
                }]
        }]
    }
}