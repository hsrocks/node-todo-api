var {SHA256} = require("crypto-js");

var message = 'I am User Number 1';

var hash= SHA256(message).toString();

console.log(hash)