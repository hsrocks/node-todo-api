const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((results)=>{
//   console.log(results)
// },(err)=>{
//   console.log(err);
// })
Todo.findOneAndRemove({
  _id :'5a2d00db01b01ff6f1d8b05e'
}).then((todo)=>{
  console.log(todo);
},(err)=>{
  console.log(err);
})

// Todo.findByIdAndRemove('5a2d00db01b01ff6f1d8b05e').then((todo)=>{
//   console.log(todo);
// },(err)=>{
//   console.log(err);
// })
