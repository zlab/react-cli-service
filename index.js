module.exports = (api, options) => {
  api.chainWebpack(chainConfig => {
    chainConfig.resolve.alias.set('src', chainConfig.resolve.alias.get('@'));
  });

  api.configureDevServer(devServerConfig => {
    devServerConfig.disableHostCheck = true;
  });
};
