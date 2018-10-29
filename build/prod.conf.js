const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const minify = require('rollup-plugin-babel-minify')
// const rollupTypescript = require('rollup-plugin-typescript')
// const typescript = require('typescript')
const rollup = require('rollup')
const version = process.env.VERSION || require('../package.json').version

const prodConf = {
  inputOptions: {
    input: 'src/index.js',
    plugins: [
      replace({
        [`process.env.NODE_ENV`]: process.env.NODE_ENV,
        __VERSION__: version,
      }),
      babel({
        exclude: 'node_modules/**',
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