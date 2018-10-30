const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const rollupTs = require('rollup-plugin-typescript')
const typescript = require('typescript')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup')
const version = process.env.VERSION || require('../package.json').version

const devConf = {
  inputOptions: {
    input: 'src/index.ts',
    plugins: [
      rollupTs({
        typescript,
      }),
      replace({
        [`process.env.NODE_ENV`]: process.env.NODE_ENV,
        __VERSION__: version,
      }),      
      nodeResolve(),
      commonjs({
        include: 'node_modules/weixin-js-sdk/**',
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