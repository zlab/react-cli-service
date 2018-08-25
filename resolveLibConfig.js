const fs = require('fs');

module.exports = (api, { entry, name }, options) => {
  // inline all static asset files since there is no publicPath handling
  process.env.VUE_CLI_INLINE_LIMIT = Infinity;

  const { log, error } = require('@vue/cli-shared-utils');

  const fullEntryPath = api.resolve(entry);

  if (!fs.existsSync(fullEntryPath)) {
    log();
    error(`Failed to resolve lib entry: ${entry}. ` +
      `Make sure to specify the correct entry file.`);
    process.exit(1);
  }

  const libName = name || api.service.pkg.name;

  function genConfig(format, postfix) {
    const config = api.resolveChainableWebpackConfig();

    // adjust css output name so they write to the same file
    if (config.plugins.has('extract-css')) {
      config.plugin('extract-css')
        .tap(args => {
          args[0].filename = `${libName}.css`;
          return args;
        });
    }

    // only minify min entry
    config.optimization.minimize(false);

    // externalize Vue in case user imports it
    config.externals({
      antd: {
        commonjs: 'antd',
        commonjs2: 'antd',
        root: 'antd',
      },
    });

    // resolve entry/output
    const entryName = `${libName}.${postfix}`;
    config.resolve.alias.set('~entry', fullEntryPath);

    // set output target before user configureWebpack hooks are applied
    config.output.libraryTarget(format);

    // set entry/output after user configureWebpack hooks are applied
    const rawConfig = api.resolveWebpackConfig(config);

    let realEntry = require.resolve('./entry-lib.js');

    // avoid importing default if user entry file does not have default export
    const entryContent = fs.readFileSync(fullEntryPath, 'utf-8');
    if (!/\b(export\s+default|export\s{[^}]+as\s+default)\b/.test(entryContent)) {
      realEntry = require.resolve('./entry-lib-no-default.js');
    }

    rawConfig.entry = {
      [entryName]: realEntry,
    };

    rawConfig.output = Object.assign({
      library: libName,
      libraryExport: undefined,
      libraryTarget: format,
      // preserve UDM header from webpack 3 until webpack provides either
      // libraryTarget: 'esm' or target: 'universal'
      // https://github.com/webpack/webpack/issues/6522
      // https://github.com/webpack/webpack/issues/6525
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    }, rawConfig.output, {
      filename: `${entryName}.js`,
      chunkFilename: `${entryName}.[name].js`,
      // use dynamic publicPath so this can be deployed anywhere
      // the actual path will be determined at runtime by checking
      // document.currentScript.src.
      publicPath: '',
    });

    return rawConfig;
  }

  return genConfig('commonjs2', 'common');
};
