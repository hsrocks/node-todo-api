const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// var User = mongoose.model('User',{
//   email : {
//     required : true,
//     trim : true,
//     type : String,
//     minlength : 1,
//     unique : true,
//     validate :{
//     validator : (value)=>{
//        return  validator.isEmail(value)
//       },
//       message : '{VALUE} is not valid email'
//     }
//   },
//   password :{
//     type : String,
//     require : true,
//     minlength : 6,
//   },
//   // the validation on access and token will work if their are item in an array else array can be empty as we
//   // are not adding validator for it so it will never go inside and validate the properties.
//   tokens :[{
//     access:{
//       type : String,
//       required : true
//     },
//     token:{
//       type : String,
//       required : true
//     }
//   }]
// })

var UserSchema = new mongoose.Schema({
  email : {
    required : true,
    trim : true,
    type : String,
    minlength : 1,
    unique : true,
    validate :{
    validator : (value)=>{
       return  validator.isEmail(value)
      },
      message : '{VALUE} is not valid email'
    }
  },
  password :{
    type : String,
    require : true,
    minlength : 6,
  },
  // the validation on access and token will work if their are item in an array else array can be empty as we
  // are not adding validator for it so it will never go inside and validate the properties.
  tokens :[{
    access:{
      type : String,
      required  : true
    },
    token:{
      type : String,
      required : true
    }
  }]
});
UserSchema.methods.toJSON= function(){
  var user =this;
  var userObject= user.toObject();
  return _.pick(userObject,['_id','email']);
}
UserSchema.methods.generateAuthToken=function (){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id : user._id.toHexString(),
    access
  },'abc123').toString();
  user.tokens.push({access,token});

  return user.save().then((user)=>{
    return token;
  })
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token,'abc123');
  }
  catch(e){
    // return new Promise((resolve,reject){
    //   reject();
    // })
    // OR
    return Promise.reject();
  }
  return User.findOne({
    _id : decoded._id,
     'tokens.token' : token,
     'tokens.access' : 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email,password){
  var User =this;
  return User.findOne({email}).then((user)=>{
    if(!user){
      console.log("here");
      return Promise.reject();
    }
    return bcrypt.compare(password,user.password).then((res)=>{
      if(res===true){
        return user
      }
      return Promise.reject();
    })
  })
}

UserSchema.pre('save',function(next){
  var user= this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password=hash;
        next();
      })
    })
  }
  else{
    next();
  }

})
var User = mongoose.model('User',UserSchema);

module.exports ={User}
