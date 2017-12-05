//const MongoClient  = require('mongodb');
const {MongoClient,ObjectID} = require('mongodb');
// Object destructuring
// var user ={
//   name : 'hs',
//   age : 23
// }
//
// var {name,age} = user;
// console.log(name,age);

// var obj= new ObjectID()
// console.log(obj)
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    console.log('unable to connect to MongoDB server');
  }
//   else {
//     console.log('Connected to the mongodb server');
//     db.collection('Todos').insertOne({text : 'something to do',
//     completed : false
//   }
// ,(err,result)=>{
//     if(err){
//     console.log('unable to insert the data into todo')
//     return ;
//   }
//   console.log(JSON.stringify(result.ops,undefined,2))
// });
//     db.close();
// }
else {
  console.log('Connected to the mongodb server');
//   db.collection('Users').insertOne({name : 'HS',
//   age : 23,
//   location : 'India'
// }
// ,(err,result)=>{
//   if(err){
//   console.log('unable to insert the data into todo')
//   return ;
// }
// console.log(JSON.stringify(result.ops,undefined,2))
// console.log(result.ops[0]._id.getTimestamp(),undefined,2)
// });
  db.close();
}
});
