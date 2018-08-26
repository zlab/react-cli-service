module.exports = (api, options) => {
  api.chainWebpack(chainConfig => {
    chainConfig.plugins.delete('progress');
    chainConfig.plugins.delete('preload');
    chainConfig.plugins.delete('prefetch');

    chainConfig.performance.hints(false);

    chainConfig.resolve.alias.set('src', chainConfig.resolve.alias.get('@'));

    // chainConfig.plugin('html').tap(args => {
    //   args[0].chunksSortMode = 'dependency';
    //   args[0].minify = false;
    //   return args;
    // });

    const pluginOptions = options.pluginOptions || {};
    const { momentLocale } = pluginOptions.react || {};
    const { ContextReplacementPlugin } = require('webpack');

    momentLocale && chainConfig.plugin('context-replacement')
      .use(ContextReplacementPlugin, [/moment[\/\\]locale$/, momentLocale]);
  });

  api.configureDevServer(devServerConfig => {
    devServerConfig.disableHostCheck = true;
  });

  api.registerCommand('library', {
    description: 'library for production',
    usage: 'react-cli-service library [options] [entry|pattern]',
    options: {
      '--name': `name for lib (default: "name" in package.json or entry filename)`,
      '--report': `generate report.html to help analyze bundle content`,
    },
  }, (args) => {
    args.entry = args.entry || args._[0];

    build(args, api, options);
  });
};

async function build(args, api, options) {
  const fs = require('fs-extra');
  const path = require('path');
  const webpack = require('webpack');
  const formatStats = require('./formatStats');
  const { log, logWithSpinner, stopSpinner } = require('@vue/cli-shared-utils');

  log();

  const mode = api.service.mode;

  logWithSpinner(`Building for ${mode} as library commonjs...`);

  // resolve raw webpack config
  let webpackConfig = require('./resolveLibConfig')(api, args, options);

  if (args.report) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      logLevel: 'warn',
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: `report.html`,
    }));
  }

  const targetDir = api.resolve(options.outputDir);

  await fs.remove(targetDir);

  return new Promise((resolve, reject) => {
    console.log(webpackConfig);

    webpack(webpackConfig, (err, stats) => {
      stopSpinner(false);
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(`Build failed with errors.`);
      }

      if (!args.silent) {
        const targetDirShort = path.relative(
          api.service.context,
          targetDir,
        );
        log(formatStats(stats, targetDirShort, api));
      }

      resolve();
    });
  });
}

module.exports.defaultModes = {
  library: 'production',
};

