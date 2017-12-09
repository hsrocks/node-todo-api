const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos=[{
  text : "Hello"
},{
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
