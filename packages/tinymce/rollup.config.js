import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import tsconfig from './tsconfig.json'

export default {
    input: 'index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'tinymce'
    },
    plugins: [
        typescript(tsconfig),
        commonjs(),
        VuePlugin({
            styleInjector: '~' + 'vue-runtime-helpers/dist/inject-style/browser.js'
        })
    ]
}
