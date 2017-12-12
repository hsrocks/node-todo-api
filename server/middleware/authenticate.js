//creating the middleware
var {User}= require('../models/user')
var authenticate=(req,res,next)=>{
  var token = req.header('x-auth');
  User.findByToken(token).then((user)=>{
    if(!user){
        //res.status(401).send(); or do Promise.reject() and it will trigger the catch block
        return Promise.reject();
    }

    else {
      // instead of sending the response back we add user and token properties to our req
      // object and call next
      req.user = user;
      req.token = token;
      next()
    }
  }).catch((e)=>{
    res.status(401).send();
  })
}

module.exports= {
  authenticate
}
