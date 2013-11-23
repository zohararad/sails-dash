module.exports = function hasDummyToken(req, res, next) {
  "use strict";
  var err,
      token = req.param('token');

  if(token && token.length){
    next();
  } else {
    err = new Error('No Token Provided');
    next(err);
  }
}