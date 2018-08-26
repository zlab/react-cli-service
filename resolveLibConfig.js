const fs = require('fs');

module.exports = (api, { entry, name }, options) => {
  const libName = name || api.service.pkg.name;

  const format = 'commonjs2', postfix = 'common';

  const config = api.resolveChainableWebpackConfig();

  // adjust css output name so they write to the same file
  if (config.plugins.has('extract-css')) {
    config.plugin('extract-css').tap(args => {
      args[0].filename = `${libName}.css`;
      return args;
    });
  }

  // only minify min entry
  config.optimization.minimize(false);

  // resolve entry/output
  const entryName = `${libName}.${postfix}`;

  // set output target before user configureWebpack hooks are applied
  config.output.libraryTarget(format);

  // set entry/output after user configureWebpack hooks are applied
  const rawConfig = api.resolveWebpackConfig(config);

  rawConfig.entry = {
    [entryName]: entry,
  };

  rawConfig.output = Object.assign({
    library: libName,
    libraryExport: undefined,
    libraryTarget: format,
  }, rawConfig.output, {
    filename: `${entryName}.js`,
    chunkFilename: `${entryName}.[name].js`,
    publicPath: '',
  });

  return rawConfig;
};
