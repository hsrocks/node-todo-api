const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb')
const todos=[{
  _id : new ObjectID(),
  text : "Hello"
},{
  _id : new ObjectID(),
  text : "Hi"
}];

beforeEach((done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text ='Test Todo Text';

    request(app).
    post('/todos')
    .send({text}).
    expect(200).
    expect((res)=>{
      expect(res.body.text).toBe(text)
    })
    // To check what got stored in our Db we are not calling end(done) instead of it
    // we are calling end(err,res)
    // err allows us to handle error that might have occurred up above
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    })
  })

  it('should not create Todo with invalid body data',(done)=>{
    request(app).
    post('/todos').
    send().
    expect(400).
    end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    })
  })
})

describe('GET /todos',()=>{
  it('should get add Todos',(done)=>{
    request(app).
    get('/todos')
    .expect(200).
    expect((res)=>{
      expect(res.body.todos.length).toBe(2)
    }).
    end(done);
  })
})


describe('GET /todos/:id',()=>{
  it('should return Todo Document',(done)=>{
    request(app).
    // to convert ObjectID to String use toHexString()
    get(`/todos/${todos[0]._id.toHexString()}`).
    expect(200)
    .expect((res)=>{
      // we set res.body.todo.text because from our server.js we are sending res.send({todo}) and todo has a text property
      expect(res.body.todo.text).toBe(todos[0].text);
    }).
    end(done);
  })

  it('should return 404 if ToDo not found',(done)=>{
    request(app).
    get(`/todos/${new ObjectID().toHexString()}`).
    expect(404).
    end(done)
  })

  it('should return 404 for non object ids',(done)=>{
    request(app).
    get(`/todos/123`).
    expect(404).
    end(done)
  })
})
