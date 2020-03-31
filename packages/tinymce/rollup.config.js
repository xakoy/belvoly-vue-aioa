import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'tinymce'
    },
    plugins: [commonjs(), VuePlugin(), typescript()]
}
