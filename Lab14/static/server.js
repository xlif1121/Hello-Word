  
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs =require ('qs');
var fs = require('fs');

var user_data_file='./user_data.json';

if (fs.existsSync(user_data_file)) {
    var user_data=JSON.parse(fs.readFileSync(user_data.file, 'utf-8')); 
} else {
    console.log(`${user_data_file} does not exist`);
}

 console.log(user_data);
 
 app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); 
    next(); 
});

app.post('/process_register', function (req, res) {
        username = req.body["username"];
        user_data[username] = {};
        user_data[username]["password"] = req.body["password"];
        user_data[username]["email"] = req.body["email"];
        user_data[username]["fullname"] = req.body["fullname"];
        user_data[username]["phone_number"] = req.body["phone_number"];
 
        fs.writeFileSync(user_data_file, JSON.stringify(user_data));
        res.send(`${username} is registered`);
    })
    