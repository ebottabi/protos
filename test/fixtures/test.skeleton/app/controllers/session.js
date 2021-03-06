
var util = require('util');

function SessionController(app) {
  
  get('/', function(req, res) {
    res.sendHeaders();
    res.end('{SESSION CONTROLLER}');
  });
  
  get('/create/:user', {user: 'alpha'}, function(req, res, params) {
    var pers = req.queryData.persistent == '1';
    app.session.create(req, res, {user: params.user}, pers, function(session, hashes, expires) {
      app.globals.userSession = session;
      res.sendHeaders({
        'X-Session-Id': hashes.sessId,
        'X-Session-Expires': (new Date(Date.now() + expires*1000)).toUTCString()
      });
      res.end(util.inspect(session));
    });
  });
  
  get('/destroy/:sid', {sid: 'md5_hash'}, function(req, res, params) {
    app.session.destroy(req, res, function() {
      res.sendHeaders();
      res.end('{SUCCESS}');
    });
  });
  
  get('/set/:varname/:value', {varname: 'alpha_dashes', value: 'alnum'}, function(req, res, params) {
    app.session.config.typecastVars.push(params.value); // automatically typecast
    req.session[params.varname] = params.value;
    res.sendHeaders();
    res.httpMessage({
      message: '{OK}',
      raw: true
    });
  });
  
  get('/:action/:varname', {action: /^(get|delete)$/, varname: 'alpha_dashes'}, function(req, res, params) {
    switch(params.action) {
      case 'get':
        var ans = util.format('{%s}', req.session[params.varname] || '');
        res.sendHeaders();
        res.end(ans);
        break;
        
      case 'delete':
        delete req.session[params.varname];
        res.sendHeaders();
        res.end('{OK}');
        break;
    }
  });
  
  get('/incr/:varname', {varname: 'alpha_dashes'}, function(req, res, params) {
    res.sendHeaders();
    if (req.session[params.varname] != null) {
      req.session[params.varname]++;
      res.end('{SUCCESS}');
    }
    else res.end('{FAIL}');
  });
  
}

module.exports = SessionController;