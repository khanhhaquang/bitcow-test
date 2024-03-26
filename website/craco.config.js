const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        .oneOf.filter((rule) => Array.isArray(rule.use));

      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (moduleLoader?.loader?.includes('resolve-url-loader'))
            moduleLoader.options.sourceMap = false;
        });
      });
      config.resolve = {
        ...config.resolve,
        fallback: {
          buffer: require.resolve('buffer'),
          stream: require.resolve("stream-browserify"),
          assert: require.resolve("assert"),
          // crypto: require.resolve("crypto-browserify"),
          url: require.resolve("url"),
          path: require.resolve("path-browserify"),
          os: require.resolve("os-browserify/browser"),
          zlib: require.resolve("browserify-zlib"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          vm: require.resolve("vm-browserify"),
          fs: false,
          net: false,
          tls:false,
          crypto:false
        }
      };

      // To disable webpack cache of node_modules when debug
      config.cache.buildDependencies.mydeps = ['./webpackBuildCache.lock'];

      return config;
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  }
};
