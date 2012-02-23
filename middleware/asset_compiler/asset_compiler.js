
/**
  Asset Compiler
  
  Provides the application with asset compilation features.
  
  » References:
  
    http://lesscss.org/
    http://coffeescript.org/
    http://learnboost.github.com/stylus/
    
  » TODO
  
    * Implement a compressor/minifier
    * Ability to merge several compiled/minified files into a single file to serve in production
    
  » Configuration options:
  
    {array} watchOn: Array containing environments in which the assets will be automatically compiled on change
    {array} compile: Extensions to compile and/or watch.
    {object} compileExts: Object containing the target extensions of compiled assets. Contains {ext: outExt}
    {object} compilers: Object containing the functions that compile the target extensions.
    {boolean} assetSourceAccess: If set to true, will enable access to the asset sources (disabled by default)
    
    If the `compile` array is found in the middleware configuration object, then the default assets (such as
    less, coffee & stylus) will be disabled and replaced with your own extensions. This allow to only watch
    for .coffee files, for example.
    
  » Adding Custom Extensions & Compilers
  
    You can define your own extensions and compilers to be used by the application. CoreJS provides a solid
    platform in which you can extend upon, and integrate your own asset compilers. Here's how you do it:
    
    1) Add the custom extension in the `compile` array
    2) Add the target extension of the compiled file in the `compiledExts` object
    3) Add the Compiler function, receiving [source, callback] into the `compilers` object. 
       The function should run the callback with [err, code]
    
    These are the steps required to register your own extension to compile/watch. You will now be able to 
    compile and watch the files with your custom extension.
    
    You don't need to worry about preventing access to the source of your custom extension, since the middleware
    will automatically respond with HTTP/404 on access to the resource.
    
    Also, your custom compiler automatically has watch support. If you make any changes to your source file, the
    resource will be automatically compiled.
    
  » Debug Messages
  
    The middleware prints debugging information into the console. Set `app.debugLog` to true if you want to
    inspect the logs.
    
 */

var app = corejs.app;

function AssetCompiler(config, middleware) {
  
  // Check for dependencies
  
  if (!app.supports.static_server) {
    throw new Error("The 'asset_compiler' middleware requires 'static_server'");
  }
  
  // Extend configuration
  config = corejs.configExtend({
    watchOn: ['development', 'debug'],
    compile: ['less', 'styl', 'coffee'],
    assetSourceAccess: false,
    compilers: require('./compilers.js'),
    compileExts: {
      coffee: 'js',
      styl: 'css',
      less: 'css',
    }
  }, config);
  
  // Expose config into app config
  app.config.assetCompiler = config;
  
  // Run Assets manager
  require('./asset-manager.js');
  
}

module.exports = AssetCompiler;