const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users =[{
  _id : userOneId,
  email : 'hs@example.com',
  password : 'userOnePass',
  tokens:[{
    access : 'auth',
    token : jwt.sign({
      _id : userOneId.toHexString(),
      access : 'auth'
    },process.env.JWT_SECRET).toString()
  }]
},{
  _id : userTwoId,
  email : 'my@example.com',
  password : 'userTwoPass',
  tokens:[{
    access : 'auth',
    token : jwt.sign({
      _id : userTwoId.toHexString(),
      access : 'auth'
    },process.env.JWT_SECRET).toString()
  }]
}];

const todos=[{
  _id : new ObjectID(),
  text : "Hello",
  _creator : userOneId
},{
  _id : new ObjectID(),
  text : "Hi",
  completed : true,
  completedAt : 33,
  _creator : userTwoId
}];

const populateTodos = (done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
}

const populateUsers = (done) => {
    User.remove({}).then(()=>{
      var userOne= new User(users[0]).save();
      var userTwo= new User(users[1]).save();

      // I have returned promise so that I can call then to complete the populateUsers
      return Promise.all([userOne, userTwo])
    }).then(()=>done());
};

module.exports ={
  todos,
  populateTodos,
  users,
  populateUsers
}
