module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    webpackConfig.plugins.delete('progress');

    webpackConfig.performance.hints(false);

    webpackConfig.resolve.alias.set('src', webpackConfig.resolve.alias.get('@'));

    const { momentLocale, bundleAnalyzer } = options.pluginOptions || {};

    momentLocale && webpackConfig.plugin('context-replacement')
      .use(require('webpack').ContextReplacementPlugin, [/moment[\/\\]locale$/,
        momentLocale]);

    bundleAnalyzer && webpackConfig.plugin('bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  });

  api.configureDevServer(devServerConfig => {
    devServerConfig.disableHostCheck = true;
  });
};