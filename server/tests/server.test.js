const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb')

const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text ='Test Todo Text';

    request(app).
    post('/todos').
    set('x-auth',users[0].tokens[0].token)
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
    set('x-auth',users[0].tokens[0].token).
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
    get('/todos').
    set('x-auth',users[0].tokens[0].token)
    .expect(200).
    expect((res)=>{
      expect(res.body.todos.length).toBe(1)
    }).
    end(done);
  })
})


describe('GET /todos/:id',()=>{
  it('should return Todo Document',(done)=>{
    request(app).
    // to convert ObjectID to String use toHexString()
    get(`/todos/${todos[0]._id.toHexString()}`).
    set('x-auth',users[0].tokens[0].token).
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
    set('x-auth',users[0].tokens[0].token).
    expect(404).
    end(done)
  })

  it('should return 404 for non object ids',(done)=>{
    request(app).
    get(`/todos/123`).
    set('x-auth',users[0].tokens[0].token).
    expect(404).
    end(done)
  })
  it('should not return Todo Document created by Other user',(done)=>{
    request(app).
    // to convert ObjectID to String use toHexString()
    get(`/todos/${todos[1]._id.toHexString()}`).
    set('x-auth',users[0].tokens[0].token).
    expect(404).
    end(done);
  })
})

describe("DELTE /todos/:id",()=>{
  it('should remove the todo',(done)=>{
    request(app).
    delete(`/todos/${todos[1]._id.toHexString()}`).
    set('x-auth',users[1].tokens[0].token).
    expect(200).
    expect((res)=>{
      expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
    }).end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({_id : todos[1]._id.toHexString()}).then((todos)=>{
        expect(todos.length).toBe(0);
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should not delete the todo not belonging to user and send 400',(done)=>{
    request(app).
    delete(`/todos/${todos[0]._id.toHexString()}`).
    set('x-auth',users[1].tokens[0].token).
    expect(404).
    end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({_id : todos[1]._id.toHexString()}).then((todos)=>{
        expect(todos.length).toBe(1);
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should return 404 if Todo not found',(done)=>{
    request(app).
    delete(`/todos/${new ObjectID().toHexString()}`).
      set('x-auth',users[1].tokens[0].token).
    expect(404)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    })
  });
  //
  it('should return 404 if ObjectID is invalid',(done)=>{
    request(app).
    delete(`/todos/1234`).
    set('x-auth',users[1].tokens[0].token).
    expect(404)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    })
  });
})

describe('Patch todo/:id',()=>{
  it('should update the Todo',(done)=>{
      request(app).
      patch(`/todos/${todos[0]._id.toHexString()}`).
      set('x-auth',users[0].tokens[0].token).
      send({text : 'Hey Bro',
      completed : true
    }).expect(200).
    expect((res)=>{
      expect(res.body.todo.text).toBe('Hey Bro');
      expect(res.body.todo.completed).toBe(true);
      // expect(res.body.todo.completedAt).toBeA('number');
      expect(typeof res.body.todo.completedAt).toBe('number');
    }).
    end(done)
  })

  it('should clear completedAt when todo is not completed',(done)=>{
    request(app).
    patch(`/todos/${todos[1]._id.toHexString()}`).
    set('x-auth',users[1].tokens[0].token).
    send({text : 'Hey Bro',
    completed : false
  }).expect(200).
  expect((res)=>{
    expect(res.body.todo.text).toBe('Hey Bro');
    expect(res.body.todo.completed).toBe(false);
    expect(res.body.todo.completedAt).toBeFalsy();
  }).
  end(done)
});

it('should not update the Todo and send 404 if Todo does not belong to user',(done)=>{
    request(app).
    patch(`/todos/${todos[0]._id.toHexString()}`).
    set('x-auth',users[1].tokens[0].token).
    send({text : 'Hey Bro',
    completed : true
  }).expect(404).
  end(done)
})
})


describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app).get('/users/me').
    set('x-auth',users[0].tokens[0].token).
    expect(200).
    expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).
    end(done)
  });

  it('should return 401 if not authenticated',(done)=>{
    request(app).get('/users/me').
    expect(401).
    expect((res)=>{
      expect(res.body).toEqual({});
    }).
    end(done)
  });

  it('It should return 401 with wrong jwt signature', (done) => {
    var token = users[0].tokens[0].token.slice(0, -1) + 'Z';
    request(app)
        .get('/users/me')
        .set({'x-auth': token})
        .expect(401)
        .end(done);
});
});

describe('POST /users',()=>{
  it('should create a User',(done)=>{
    var email ='example@example.com'
    var password ='abc123!';
    request(app).post('/users').
    send({email,password}).
    expect(200).
    expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    }).
    end((err)=>{
      if(err){
        return done(err)
      }
        User.findOne({email}).then((user)=>{
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((err)=>{
          done(err);
    });
  })
});

  it('should return validation error if request invalid',(done)=>{
    var email="hs";
    var password="as";
    request(app).post('/users').send({
      email,
      password
    }).expect(400).
    end(done);
  })

  it('should not create a new user if email is in used',(done)=>{
    var email="hs@example.com";
    var password="as123344";
    request(app).post('/users').send({
      email,
      password
    }).expect(400).
    end(done);
  })
});

describe('POST /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app).post('/users/login').send({
      email : users[1].email,
      password : users[1].password
    }).expect(200).
    expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
    }).
    end((err,res)=>{
      if(err){
       return  done(err);
      }
        User.findById(users[1]._id).then((user)=>{
          expect(user.toObject().tokens[1]).toMatchObject({
            access : 'auth',
            token : res.headers['x-auth']
          });
          done();
        }).catch((err)=>{
          done(err);
        })
        });
  });

  it('should send 400 for invalid login',(done)=>{
    request(app).post('/users/login').send({
      email : users[1].email,
      password : 'wrongPassword'
    }).expect(400).
    expect((res)=>{
      expect(res.headers['x-auth']).toBeFalsy();
    }).
    end((err,res)=>{
      if(err){
       return  done(err);
      }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((err)=>{
          done(err);
        })
        });
  });
});

describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout',(done)=>{
    request(app).delete('/users/me/token').set('x-auth',users[0].tokens[0].token).
    expect(200).
    end((err,res)=>{
      if(err){
       return  done(err);
      }
        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err)=>{
          done(err);
        })
        });
  });
  it('should send 401 for unauthentiated request',(done)=>{
    request(app).delete('/users/me/token').
    expect(401).
    end(done)
  });
  it('should send 401 if request contains invalid auth header value',(done)=>{
    request(app).delete('/users/me/token').set('x-auth','asjakjdjkajdjk').
    expect(401).
    end(done)
  });
})
