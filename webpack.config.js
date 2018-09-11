const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        "piano": path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js',
        publicPath: "./dist/",
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                // 只命中src目录里的js文件，加快 Webpack 搜索速度
                include: path.resolve(__dirname, "./src")
            }
        ]
    }
};