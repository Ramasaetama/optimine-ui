const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'docs'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/public',
                    to: 'public',
                    noErrorOnMissing: true
                },
                {
                    from: 'assets',
                    to: 'assets',
                    noErrorOnMissing: true
                },
                {
                    from: 'js',
                    to: 'js',
                    noErrorOnMissing: true
                },
                {
                    from: 'css',
                    to: 'css',
                    noErrorOnMissing: true
                },
                {
                    from: '*.html',
                    to: '[name][ext]',
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: ['**/src/**', '**/index.html']
                    }
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.js']
    }
};
