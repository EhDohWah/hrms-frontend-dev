// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  // Vue CLI transpilation and linting
  transpileDependencies: ['vuetify'],
  lintOnSave: false,

  // Set publicPath to "/" so assets resolve from the root
  publicPath: '/',

  // Multi-page setup (only index)
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'HR Management System',
    },
  },

  // Dev server overlay settings
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },

  // 1) Enable Webpack 5 filesystem caching instead of cache-loader
  configureWebpack: {
    cache: {
      type: 'filesystem',
      // Optional: customize cache directory
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    },
  },

  // 2) Remove any cache-loader usage injected by Vue CLI
  chainWebpack: config => {
    ['vue', 'js', 'ts', 'tsx', 'jsx', 'eslint'].forEach(ruleName => {
      const rule = config.module.rule(ruleName)
      if (rule) {
        rule.uses.delete('cache-loader')
      }
    })
  }
})
