/* eslint-disable */
const __TEST__ = process.env.VUE_APP_CURRENTMODE === 'test';
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 基本路径
    publicPath: '/',
    // 输出文件目录
    outputDir: __TEST__ ? 'test' : 'dist',
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    devServer: {
        disableHostCheck: true,
        // 设置代理
        proxy: {
            '/api': {
                target: 'http://139.219.101.67:39165/api',
                ws: true, // 是否启用websockets
                changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite: {
                    '^/api': '',
                },
            },
            '/ajax': {
                target: 'http://139.219.101.67:39165/ajax',
                ws: true, // 是否启用websockets
                changeOrigin: true,
                pathRewrite: {
                    '^/ajax': '',
                },
            }
        },
    },
};
