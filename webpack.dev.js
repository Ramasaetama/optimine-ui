const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        client: {
            overlay: {
                errors: false,  // Disable to prevent cross-origin error noise
                warnings: false,
                runtimeErrors: false  // Explicitly disable runtime errors overlay
            }
        }
    }
});
