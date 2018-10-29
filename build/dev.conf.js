const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const typescript = require('rollup-plugin-typescript')
const rollup = require('rollup')
const version = process.env.VERSION || require('../package.json').version

const devConf = {
  inputOptions: {
    // TODO: typescript entry
    input: 'src/index.ts',
    // input: 'src/index.js',
    plugins: [
      replace({
        [`process.env.NODE_ENV`]: process.env.NODE_ENV,
        __VERSION__: version,
      }),
      // babel({
      //   exclude: 'node_modules/**',
      // }),
      // TODO: typescript plugins
      typescript({
        typescript: require('typescript'),
      }),
      serve({
        contentBase: './example/',
        port: 3335,
        open: true,
        historyApiFallback: true,
      }),    
      livereload({
        watch: './example/bundle.js'
      })
    ],
  },
  outputOptions: {
    name: 'WechatShare',
    file: './example/bundle.js',
    format: 'iife',    
  },
}
module.exports = devConf