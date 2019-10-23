const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin({ openAnalyzer: false })]
  }
};
