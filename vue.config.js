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

  // 1) Enable Webpack 5 filesystem caching and Vue feature flags
  configureWebpack: {
    cache: {
      type: 'filesystem',
      // Optional: customize cache directory
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    },
    plugins: [
      new (require('webpack')).DefinePlugin({
        // Vue 3 Feature Flags - Required for proper tree-shaking
        __VUE_OPTIONS_API__: JSON.stringify(true),                    // Enable Options API support
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),                 // Disable devtools in production
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // Disable hydration mismatch details in prod

        // Additional Vue 3.5+ flags
        __VUE_EXPERIMENTAL_ASYNC_COMPONENTS__: JSON.stringify(false),
        __VUE_EXPERIMENTAL_EMIT_WARNINGS__: JSON.stringify(false)
      })
    ]
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
