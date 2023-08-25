const webpack = require("webpack");
const { aliasWebpack } = require("react-app-alias");

module.exports = function override(config, env) {
  aliasWebpack({})(config);

  config.resolve.fallback = {
    url: require.resolve("url"),
    fs: false,
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    path: false,
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    })
  );

  let loaders = config.module.rules[1].oneOf;
  loaders.splice(loaders.length - 1, 0, {
    test: /\.md$/i,
    use: "raw-loader",
  });

  return config;
};
