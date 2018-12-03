'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.configureWebpack.setConfig({
  additionalConfiguration: function (config) {
    var vueConfig = {
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
      },
      module: {
        rules: [{
            test: /\.vue$/,
            use: [{
              loader: 'vue-loader',
              options: {
                esModule: true
              }
            }]
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader'
          },
          {
            test: /\.js$/,
            use:[
                {
                    loader: 'babel-loader',
                    options:{
                        presets:['es2015']
                    }
                }
            ],
            exclude:/node_modules/
          },
        ]
      },
      plugins: [
        new VueLoaderPlugin()
      ]
    };
    return merge(config, vueConfig);
  }
});
// let copyOtherFiles = build.subTask('copy-other-files', function (gulp, buildOptions, done) {
//   return gulp.src(['src/**/*.vue', 'src/**/*.scss'])
//     .pipe(gulp.dest(buildOptions.libFolder))
// });

// build.task('copy-other-files', copyOtherFiles);
// build.rig.addPostTypescriptTask(copyOtherFiles);
build.initialize(gulp);