
/* Kernel */

var kernel = require('kernel'),
    util = require('util'),
    generator = kernel.generator,
    parser = kernel.parser,
    tokenizer = kernel.tokenizer,
    helpers = kernel.helpers;

// https://github.com/c9/kernel

function Kernel(app) {
  this.app = app;
  this.module = kernel;
  this.async = true;
  this.multiPart = true;
  this.extensions = ['kernel'];
}

util.inherits(Kernel, framework.lib.engine);

Kernel.prototype.render = function(data) {
  var tpl, func = this.getCachedFunction(arguments);
  if (func === null) {
    tpl = this.compile.apply(this, arguments);
    if (typeof tpl === 'function') {
      func = function(locals, callback) {
        tpl(locals, function(err, html) {
          callback.call(null, html || err);
        });
      }
    } else {
      func = tpl; // Errors compiling template
    }
    this.cacheFunction(func, arguments);
  }
  return this.eval(func, arguments);
}

Kernel.prototype.compile = function(source, vars, relPath) {
  try {
    return Function("var helpers = this;\nreturn " 
    + generator(parser(tokenizer(source), source, this.app.fullPath(relPath))))
    .call(helpers);
  } catch(e) {
    return e;
  }
}

Kernel.prototype.makePartialAsync = function(func) {
  var cached = this.cache[func.id];
  if (cached instanceof Function) { 
    return cached;
  } else {
    function async(arg, callback) {
      func(arg, function(buf) {
        callback(null, buf);
      });
    }
    function sync(arg, callback) {
      callback(null, func(arg));
    }
    return this.__makePartialAsync(func, async, sync);
  }
}

module.exports = Kernel;
