// vue.config.js
/**
 * Vue CLI Configuration
 * 
 * Optimized for:
 * - Memory efficiency (code splitting)
 * - Build performance (filesystem caching)
 * - Production bundle size (tree-shaking, vendor splitting)
 * 
 * @version 2.0.0 - Performance optimized
 */

const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

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

  // Webpack configuration
  configureWebpack: {
    // Enable filesystem caching for faster rebuilds
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
      buildDependencies: {
        config: [__filename],
      },
    },

    // Define plugins
    plugins: [
      new webpack.DefinePlugin({
        // Vue 3 Feature Flags - Required for proper tree-shaking
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],

    // Optimization settings
    optimization: {
      // Enable module concatenation for smaller bundles
      concatenateModules: true,

      // Split chunks for better caching
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '-',
        cacheGroups: {
          // Vue core libraries
          vue: {
            test: /[\\/]node_modules[\\/](@vue|vue|vue-router|pinia)[\\/]/,
            name: 'vendor-vue',
            chunks: 'all',
            priority: 30,
          },

          // Ant Design Vue (large library)
          antd: {
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            name: 'vendor-antd',
            chunks: 'all',
            priority: 25,
          },

          // Bootstrap & related
          bootstrap: {
            test: /[\\/]node_modules[\\/](bootstrap|bootstrap-vue-3)[\\/]/,
            name: 'vendor-bootstrap',
            chunks: 'all',
            priority: 25,
          },

          // Chart libraries
          charts: {
            test: /[\\/]node_modules[\\/](apexcharts|vue3-apexcharts)[\\/]/,
            name: 'vendor-charts',
            chunks: 'async',
            priority: 20,
  },

          // CKEditor (large editor library)
          ckeditor: {
            test: /[\\/]node_modules[\\/]@ckeditor[\\/]/,
            name: 'vendor-ckeditor',
            chunks: 'async',
            priority: 20,
          },

          // Laravel Echo and Pusher
          echo: {
            test: /[\\/]node_modules[\\/](laravel-echo|pusher-js)[\\/]/,
            name: 'vendor-echo',
            chunks: 'async',
            priority: 15,
          },

          // Common vendor chunk for other node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor-common',
            chunks: 'initial',
            priority: 10,
            reuseExistingChunk: true,
          },

          // Common chunks for shared code
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },

      // Runtime chunk for caching
      runtimeChunk: {
        name: 'runtime',
      },
    },

    // Performance hints
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },

  // Chain webpack for advanced configuration
  chainWebpack: config => {
    // Remove cache-loader (using filesystem cache instead)
    ['vue', 'js', 'ts', 'tsx', 'jsx', 'eslint'].forEach(ruleName => {
      const rule = config.module.rule(ruleName)
      if (rule) {
        rule.uses.delete('cache-loader')
      }
    })

    // Optimize images using webpack 5 asset modules (replaces url-loader)
    config.module
      .rule('images')
      .set('type', 'asset')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 10KB - inline images smaller than this
        },
      })

    // Add bundle analyzer in analyze mode
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [{
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,
      }])
    }

    // Production optimizations
    if (process.env.NODE_ENV === 'production') {
      // Minimize JS
      config.optimization.minimize(true)

      // Drop console logs in production
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions = {
          ...args[0].terserOptions,
          compress: {
            ...args[0].terserOptions?.compress,
            drop_console: true,
            drop_debugger: true,
          },
        }
        return args
      })
    }
  },

  // CSS configuration
  css: {
    // Extract CSS in production for better caching
    extract: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production',
  },
})
