module.exports = (api, options) => {
  api.chainWebpack(chainConfig => {
    chainConfig.plugins.delete('progress');
    chainConfig.plugins.delete('preload');
    chainConfig.plugins.delete('prefetch');

    chainConfig.performance.hints(false);

    chainConfig.resolve.alias.set('src', chainConfig.resolve.alias.get('@'));

    const pluginOptions = options.pluginOptions || {};
    const { momentLocale } = pluginOptions.react || {};
    const { ContextReplacementPlugin } = require('webpack');

    momentLocale && chainConfig.plugin('context-replacement')
      .use(ContextReplacementPlugin, [/moment[\/\\]locale$/, momentLocale]);
  });

  api.configureDevServer(devServerConfig => {
    devServerConfig.disableHostCheck = true;
  });
};
