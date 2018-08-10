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
    const { momentLocale, bundleAnalyzer } = pluginOptions.react || {};

    momentLocale && chainConfig.plugin('context-replacement')
      .use(require('webpack').ContextReplacementPlugin, [/moment[\/\\]locale$/,
        momentLocale]);

    // bundleAnalyzer && webpackConfig.plugin('bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  });

  api.configureDevServer(devServerConfig => {
    devServerConfig.disableHostCheck = true;
  });
};
