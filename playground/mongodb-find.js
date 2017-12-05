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
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to the mongodb server');
  //fetch everything
  // db.collection('Todos').find().toArray().then((docs)=>{
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs,undefined,2))
  // },(err)=>{
  //   console.log('Unable to fect to do',err)
  // })

  //fetch based on something
  // db.collection('Todos').find({_id:new ObjectID('5a257e03d53fc581a35bba4a')}).toArray().then((docs)=>{
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs,undefined,2))
  // },(err)=>{
  //   console.log('Unable to fect to do',err)
  // })

  //count the documents
  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos count : ${count}`)
  // },(err)=>{
  //   console.log('Unable to fect to do',err)
  // })
  db.collection('Users').find({name : 'Raman'}).toArray().then((user)=>{
    console.log('Users')
    console.log(JSON.stringify(user,undefined,2))
  },(err)=>{
    console.log('Unable to fect to do',err)
  })
  // db.close();
});
