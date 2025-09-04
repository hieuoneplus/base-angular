const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "pmp_admin",
    scriptType: "text/javascript"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      // For remotes (please adjust)
      name: "pmp_admin",
      library: { type: "var", name: "pmp_admin" },
      filename: "remoteEntry.js",
      exposes: {
        './web-components': './src/bootstrap.ts',
      },
      shared: {
        "@angular/core": {
          singleton: true
        },
        "@angular/common": {
          singleton: true
        },
        "@angular/router": {
          singleton: true
        }
      }
    })
  ],
};
