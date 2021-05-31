module.exports = function override(config, env) {
  config.output.filename = env === 'production'
    ? 'static/js/[name].[contenthash].js'
    : env === 'development' && 'static/js/bundle.js';

  return config;
}
