const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to the mongodb server');
//   db.collection('Todos').findOneAndUpdate({_id : new ObjectID("5a26d043afc9180afa196167")
// },{$set: {
//   completed: true
// }
// },{
//   returnOriginal :false
// }).then((result)=>{
//   console.log(result);
// },(err)=>{
//   console.log("Error occured",err);
// })

db.collection('Users').findOneAndUpdate({_id : new ObjectID("5a23cb9ddf5a562ebc5757aa")},{ $set:{
  name : 'Harpreet'
},$inc :{
  age : 1
}
},{returnOriginal:false}).then((doc)=>{
  console.log('Updated doc :',doc);
},(err)=>{
  console.log(`Error occurred due to : ${err}`);
})
  // db.close();
});
