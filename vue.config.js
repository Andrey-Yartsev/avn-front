module.exports = {
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true
  },
  publicPath: process.env.VUE_APP_CDN_PATH
};
