
/* Asset compilers */

var less = require('less'),
    stylus = require('stylus'),
    nib = require('nib'),
    coffee = require('coffee-script'),
    pathModule = require('path');

// Asset compilers
module.exports = {
  
  less: function(source, file, callback) {
    less.render(source, {
      filename: pathModule.basename(file),
      paths: [pathModule.dirname(file)]
    }, callback);
  },
  
  styl: function(source, file, callback) {
    stylus(source)
      .set('filename', file)
      .use(nib())
      .import('nib')
      .render(callback)
    ;
  },
  
  coffee: function(source, file, callback) {
    callback(null, coffee.compile(source));
  }
  
}