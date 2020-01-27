module.exports = {
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true
  },
  publicPath: process.env.VUE_APP_CDN_PATH,
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        output: {
          filename: "js/[name].[chunkhash:8].js",
          chunkFilename: "js/[name].[chunkhash:8].js"
        }
      };
    }
  }
};
