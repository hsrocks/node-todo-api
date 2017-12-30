require('./../config/config');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} =require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const _ = require('lodash');
var app = express();
const {ObjectID} = require('mongodb');
const port= process.env.PORT;
var {authenticate} = require('./middleware/authenticate')
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

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  else{
    Todo.findById(id).then((todo)=>{
      if(todo){
      res.send({todo})
    }
    else {
      res.status(404).send()
    }
    },(err)=>{
      // send it using send() without any argument as error might contain the private information
      // we dont want to expose to client
      res.status(400).send();
    })
  }
})

app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  else{
    Todo.findByIdAndRemove(id).then((todo)=>{
      if(todo){
        res.send({todo})
      }
      else{
        res.status(404).send();
      }
    },(err)=>{
      res.status(400).send();
    })
  }
})

// we will use lodash to basically control the user not to update certain properties like
// completedAt we want its value to be generated by Mongoose and user cant modify it
// Also lodash utility provide various other utility method also
app.patch('/todos/:id',(req,res)=>{
  var id =req.params.id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // we will check if completed property is boolean and is true then we will update the completeAt property
  // to current time
  if(_.isBoolean(body.completed) && body.completed){
      body.completedAt=new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id,{$set:
    body
  },{
    new : true
  }).then((todo)=>{
    if(todo){
      res.send({todo});
    }
    else{
      res.status(404).send();
    }
  },(err)=>{
    res.status(400).send();
  })
});

app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user=new User(body)

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((err)=>{
    res.status(400).send(err);
  })
})

// app.get('/users/me',(req,res)=>{
//   var token = req.header('x-auth');
//   User.findByToken(token).then((user)=>{
//     if(!user){
//         //res.status(401).send(); or do Promise.reject() and it will trigger the catch block
//         return Promise.reject();
//     }
//
//     else {
//
//       res.send(user);
//     }
//   }).catch((e)=>{
//     res.status(401).send();
//   })
// })

app.get('/users/me',authenticate,(req,res)=>{
      // user is the property set by middleware in case user and token exist
      res.send(req.user);
})

app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
    res.header('x-auth',token).send(user);
  });
    }).catch((err)=>{
    res.status(400).send();
  })
})
// exported app for testing so to use this object and request for various GET /POST method
module.exports ={app};
app.listen(port,()=>{
  console.log("started on port",port);
})
