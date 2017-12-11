const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
      required : true
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
  var access = this;
  var token = jwt.sign({
    _id : user._id.toHexString(),
    access
  },'abc123').toString();
  user.tokens.push({access,token});

  return user.save().then((user)=>{
    return token;
  })
};

var User = mongoose.model('User',UserSchema);

module.exports ={User}
