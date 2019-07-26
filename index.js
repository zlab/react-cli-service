module.exports = (api, options) => {
  api.chainWebpack(config => {
    config.resolve.alias.set('src', config.resolve.alias.get('@'));

    if (options.pluginOptions && options.pluginOptions.react) {
      const { react } = options.pluginOptions;
      if (react.typescript) {
        config.entry('app').clear().add('./src/main.tsx');
      } else {
        config.entry('app').clear().add('./src/main.js');
      }
    }
  });

  api.configureDevServer(config => {
    config.disableHostCheck = true;
  });
};
