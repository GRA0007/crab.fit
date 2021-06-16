const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');
// const fs = require('fs');
// const glob = require('glob');
// const crypto = require('crypto');

// const fileHash = path => {
//   let file_buffer = fs.readFileSync(path);
//   let sum = crypto.createHash('md5');
//   sum.update(file_buffer);
//   return sum.digest('hex');
// };

module.exports = function override(config, env) {
  config.output.filename = env === 'production'
    ? 'static/js/[name].[contenthash].js'
    : env === 'development' && 'static/js/bundle.js';

  config.output.chunkFilename = env === 'production'
    ? 'static/js/[name].[contenthash].chunk.js'
    : env === 'development' && 'static/js/[name].chunk.js';

  if (env === 'production') {
    config.plugins.push(new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'src/sw.js'),
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      additionalManifestEntries: [
        // ...glob.sync('./public/i18n/*/*.json').map(file => {
        //   return ({
        //     url: file.replace('./public', ''),
        //     revision: fileHash(file),
        //   });
        // }),
        {
          url: '/index.css',
          revision: null,
        },
        {
          url: '/manifest.json',
          revision: null,
        },
      ],
    }));
  }

  return config;
}
