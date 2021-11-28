const webpack = require('webpack');
const path = require('path');

require('dotenv').config({ path: './.env' });

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'extension.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            "OMDB_API_KEY": JSON.stringify(process.env["OMDB_API_KEY"] || null),
        })
    ]
};