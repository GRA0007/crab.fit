module.exports = function override(config, env) {
  config.output.filename = env === 'production'
    ? 'static/js/[name].[contenthash].js'
    : env === 'development' && 'static/js/bundle.js';

  config.output.chunkFilename = env === 'production'
    ? 'static/js/[name].[contenthash].chunk.js'
    : env === 'development' && 'static/js/[name].chunk.js';

  return config;
}
