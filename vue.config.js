/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')

const { name, version } = require('./package')
function resolve(dir) {
    // 路径可能与你的项目不同
    return path.join(__dirname, dir)
}

// const IS_PROD = false
const publicPath = process.env.VUE_APP_PUBLICPATH

process.env.VUE_APP_VERSION = version
process.env.VUE_APP_NAME = name

module.exports = {
    publicPath: publicPath,
    productionSourceMap: false,
    devServer: {
        open: true,
        port: 8000,
        https: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
}
