// vue.config.js
module.exports = {

  outputDir: "../annette-axon/axon-backend/public/dist",
  //assetsDir: "assets/dist/",
  publicPath: "assets/dist/",

  // настройки...
  configureWebpack: {
    devtool:  'source-map',

    // output: {
    //   publicPath: '/dist/assets'
    // }
  },



//   devServer: {
//     historyApiFallback: true,
//     watchOptions: { aggregateTimeout: 300, poll: 1000 },
//     headers: {
//       "Access-Control-Allow-Origin": "*",
// //      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
// //      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
//     }
//   },
}

