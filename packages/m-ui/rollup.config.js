import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
// import tsconfig from './tsconfig.json'

export default {
    input: 'index.ts',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'm_ui'
    },
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false
                }
            }
        }),
        commonjs(),
        VuePlugin({
            // compileTemplate: true
            // typescript: tsconfig
        })
    ],
    external: ['@belvoly-vue-aioa/m-core']
}
