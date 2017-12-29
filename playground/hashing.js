// // var {SHA256} = require("crypto-js");
// //
// // var message = 'I am User Number 1';
// //
// // var hash= SHA256(message).toString();
// //
// // console.log(hash);
// //
// // var data ={
// //   id : 3
// // };
// //
// // var token={
// //   data,
// //   hash : (SHA256(JSON.stringify(data))+'someSecret').toString()
// // }
// //
// // var resultHash =(SHA256(JSON.stringify(token.data))+'someSecret').toString();
// //
// // if(token.hash === resultHash){
// //   console.log('Data was not changed');
// // }
// // else {
// //   console.log('Data was changed');
// // }
// const jwt = require('jsonwebtoken');
//
// var data = {
//   id : 10
// }
// var token = jwt.sign(data,'123abc');
// console.log(token)
//
// var decodedResult = jwt.verify(token,'123abc');
// console.log(decodedResult);
const bcrypt = require('bcryptjs');

 var password = "1223abc!";
// bcrypt.genSalt(1,(err,salt)=>{
//   bcrypt.hash(password,salt,(err,hash)=>{
//     console.log(hash);
//   })
// })


var password1 = "$2a$04$6sZsndOO9FKkh1CoSxNqnO80o7wsjXpLpAN9jLu3XYxmLhTcjwQV."
bcrypt.compare(password,password1,(err,res)=>{
  console.log(res);
})
