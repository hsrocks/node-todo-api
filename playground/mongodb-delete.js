const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to the mongodb server');
  //deleteMany()

  // db.collection('Todos').deleteMany({text : 'eat lunch'}).then((result)=>{
  //   console.log(result)
  // },(err)=>{
  //   console.log(err)
  // })
  // db.collection('Todos').deleteOne({text : 'eat lunch'}).then((result)=>{
  //   console.log(result)
  // },(err)=>{
  //   console.log(err)
  // })

  // findOneAndDelete()
  // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
  //   console.log(result);
  // })

  //Delete many from users
  db.collection('Users').deleteMany({name : 'HS'}).then((result)=>{
    console.log('Documents deleted successfully',result);
  },(err)=>{
    console.log(err)
  })

  db.collection('Users').findOneAndDelete({_id : new ObjectID("5a2813d75b0362fd600f2700")}).then((document)=>{
    console.log('Documents deleted successfully',document);
  },(err)=>{
    console.log(err)
  })
  // db.close();
});
