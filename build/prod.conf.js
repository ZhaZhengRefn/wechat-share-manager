// const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const minify = require('rollup-plugin-babel-minify')
const rollupTs = require('rollup-plugin-typescript')
const typescript = require('typescript')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup')
const version = process.env.VERSION || require('../package.json').version

const prodConf = {
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
      minify(),
    ],    
  },
  outputOptions: {
    name: 'WechatShare',
    file: './dist/index.js',
    format: 'umd',    
  },
}

module.exports = prodConf