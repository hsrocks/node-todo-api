const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = '5a296c94e867123700ae3be9'

User.findById(id).then((user)=>{
  if(!user){
    return console.log('User cant be found');
  }
  console.log('User is',user);
}).catch((e)=>{
  console.log(e);
})
//
// Todo.find({
//   _id : id
// }).then((todos)=>{
//   console.log(`Todos are ${todos}`)
// },(err)=>{
//   console.log(err)
// });
// if(!ObjectID.isValid(id)){
//   console.log('ID is not valid')
// }
// Todo.findOne({
//   _id : id
// }).then((todo)=>{
//   console.log(`Todo is ${todo}`)
// }).catch((e)=>{
//   console.log('Error occurred due to',e)
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log("ID not found");
//   }
//   console.log(`Todo is ${todo}`)
// },(err)=>{
//   console.log(err)
// });
