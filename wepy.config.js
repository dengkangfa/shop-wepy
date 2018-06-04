const path = require('path');
let prod = process.env.NODE_ENV === 'production';

module.exports = {
  eslint: false,
  wpyExt: ".wpy",
  build: {
    web: {
    }
  },
  compilers: {
    sass: {
      outputStyle: 'compact'
    },
    babel: {
      sourceMap: true,
      presets: [
        "es2015",
        "stage-1"
      ],
      plugins: [
        "transform-export-extensions",
        "syntax-export-extensions",
        'transform-decorators-legacy'
      ]
    }
  }
};


if (prod) {

  delete module.exports.compilers.babel.sourcesMap;

  // 压缩less
  module.exports.compilers['sass'] = {outputStyle: 'compressed'};

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {
      }
    },
    /*imagemin: {
      filter: /\.(jpg|png|jpge)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }*/
  }
}

