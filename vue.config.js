// vue.config.js

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development' ) {
  outDir = 'dist'
} else {
  outDir = "../annette-axon/axon-backend/public/dist"
}

module.exports = {

  // outputDir: "../annette-axon/axon-backend/public/dist",
  outputDir: outDir,
  //assetsDir: "assets/dist/",
  publicPath: "assets/dist/",

  // настройки...
  configureWebpack: {
    devtool:  'source-map',

    // output: {
    //   publicPath: '/dist/assets'
    // }
  },

  devServer: {
    contentBase: outDir,
    port: 8080,
    // Send API requests on localhost to API server get around CORS.
    proxy: 'http://localhost:9000'
  },

}

