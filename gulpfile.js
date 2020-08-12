const { src, dest, series} = require('gulp');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

const entry = '../egg_wx'
// const entry = './demo'
const output = './dist'


const isJS = (file) => file.extname === '.js';
const isCSS = (file) => file.extname === '.wxss' || file.extname === '.css';
const isWXML = (file) => file.extname === '.wxml';

const jsChannel = lazypipe()
  .pipe( babel, { presets: ['@babel/env'] } )
  .pipe( uglify )

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
  .pipe(gulpif( isWXML, htmlmin({
    caseSensitive: true,    //  大小写敏感
    removeComments: true,   // 	删除HTML注释
    keepClosingSlash: true, // 单标签上保留斜线
    html5: false,           // 
  })))
  .pipe(dest(output))
  console.log('%c finish', 'color: #22aa66')
}

exports.clean = clean
exports.default = series( clean, fileHandle)