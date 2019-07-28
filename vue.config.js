module.exports = {
    configureWebpack:{
     


      performance: {
        hints:'warning',
        maxEntrypointSize: 5000000,
        maxAssetSize: 3000000,
        assetFilter: function(assetFilename){
            return assetFilename.endsWith('.js')
        }
      }
    }
}