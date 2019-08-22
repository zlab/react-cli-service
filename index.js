const { enableTypescript } = require('./utils');

module.exports = (api, options) => {
  api.chainWebpack(config => {
    config.resolve.alias.set('src', config.resolve.alias.get('@'));

    if (enableTypescript) {
      config.entry('app').clear().add('./src/main.tsx');
    }
  });

  api.configureDevServer(config => {
    config.disableHostCheck = true;
  });
};
