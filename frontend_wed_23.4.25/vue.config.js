const {defineConfig} = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')


module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ],
        devServer: {
            // open: true,
            // host: "localhost",
            // port: 8080,
            proxy: {
                "/api": {
                    target: "https://api.weixin.qq.com",
                    secure: false,
                    pathRewrite: {"^/api": ""}
                },
                "/data": {
                    target: "http://1.15.52.221:5000",
                    changeOrigin:true,
                    ws:true,
                    secure: false,
                    pathRewrite: {"^/data": ""}
                }
            }
        },
        /*devServer1: {
            host: "localhost",
            port: 8080,
            proxy: {
                "/data": {
                    target: "http://1.15.52.221:5000",
                    changeOrigin:true,
                    ws:true,
                    secure: false
                }
            }
        },*/
    }
})

