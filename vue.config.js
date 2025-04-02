const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  lintOnSave: false,
  // Set publicPath to "/" so assets are referenced from the root.
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'HR Management System',
    },
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
      // Or disable the overlay entirely:
      // overlay: false,
    },
  },
});

