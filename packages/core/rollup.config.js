import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import tsconfig from './tsconfig.json'

console.log(tsconfig)

export default {
    input: 'index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'core'
        },
        {
            file: 'dist/index.es.js',
            format: 'es'
        }
    ],
    plugins: [commonjs(), VuePlugin(), typescript(tsconfig)]
}
