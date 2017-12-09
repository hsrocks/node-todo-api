const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} =require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var app = express();

app.listen(3000,()=>{
  console.log("started on port 3000");
})
// Parses the body data sent and convert into JS object
// Its a middleware and the return result will be used in our routes
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text : req.body.text
  })
  todo.save().then((doc)=>{
    res.send(doc)
  },(err)=>{
    res.status(400).send(err)
  })
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    // if we pass the response like this res.send(todos) we are loccking ourself
    // we cant be able to add custom properties because todos will be array of todo so better
    //pass it as object like   res.send({todos}) ; we can add custom properties in it like
    //   res.send({todos,code : 'asadp'})
      res.send({todos})
  },(err)=>{
    res.status(400).send(err)
  })
})
module.exports ={app};
