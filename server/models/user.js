const mongoose = require('mongoose');
var validator = require('validator');
var User = mongoose.model('User',{
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
})

module.exports ={User}
