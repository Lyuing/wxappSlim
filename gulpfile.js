const { src, dest, series} = require('gulp');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

// const entry = '../wx'    // 小程序地址
const entry = './demo'      // 示例地址
const output = './dist'     // 输出目录


const isJS = (file) => file.extname === '.js';
const isCSS = (file) => file.extname === '.wxss' || file.extname === '.css';
const isWXML = (file) => file.extname === '.wxml';

const jsChannel = lazypipe()
  .pipe( babel, { presets: ['@babel/env'] } )
  .pipe( uglify, {
    // 压缩配置
    compress: {
      drop_console: true,
    },
    // 输出配置
    output: {
      comments: false,    // 移除注释
    },
    toplevel: false,    // 混淆最高作用域中的变量和函数名
  })

// 清理
async function clean(){
  await del(output);
}
async function fileHandle() {
  src([ 
    `${entry}/**/*`,
    `!${entry}/**/.*`,
    `!${entry}/node_modules/*`,
    `!${entry}/**/*.md`,
  ], {
    allowEmpty: true
  })
  // 分别处理 js、wxss、wxml
  .pipe(gulpif( isJS, jsChannel()))
  .pipe(gulpif( isCSS, cleanCss()))
  // 取消对 wxml 的处理，<input></input>等与 html 中存在冲突
  // .pipe(gulpif( isWXML, htmlmin({
  //   caseSensitive: true,    //  大小写敏感
  //   removeComments: true,   // 	删除HTML注释
  //   keepClosingSlash: true, // 单标签上保留斜线
  // })))
  .pipe(dest(output))
}

exports.clean = clean
exports.default = series( clean, fileHandle)
