const rollup = require('rollup')
const nodeEnv = process.env.NODE_ENV || 'development'
const conf = nodeEnv === 'development' ? require('../build/dev.conf') : require('../build/prod.conf')

const build = async function() {
  const {
    inputOptions,
    outputOptions,
  } = conf
  const bundle = await rollup.rollup(inputOptions)

  const {
    code,
    map,
  } = await bundle.generate(outputOptions)

  await bundle.write(outputOptions)
}

const watch = async function() {
  const {
    inputOptions,
    outputOptions,
  } = conf  
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {
      include: './src/**',
    }    
  };
  const watcher = await rollup.watch(watchOptions);
  
  watcher.on('event', event => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //   FATAL        — encountered an unrecoverable error
  });
  
  // stop watching
  // watcher.close();
}

nodeEnv === 'development' ? watch() : build()