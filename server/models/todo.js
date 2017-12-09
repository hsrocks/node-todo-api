const mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
  text : {
    type : String,
    required : true,
    minlength :1,
    // deletes any trailing and leading whitespace s
    trim : true
  },
  completed : {
    type : Boolean,
    default : false
  },
  completedAt: {
    type : Number,
    default : null
  }
});

module.exports = {Todo};
