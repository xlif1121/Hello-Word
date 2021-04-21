var express = require('express');
var app = express();
var myParser = require("body-parser"); 
const { response } = require('express');
app.use(myParser.urlencoded({ extended: true })); 
var qs = require('qs');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + 'with query' + JSON.stringify(request.query));
    next(); 
}); 

app.post('/process_login', function (request, response, next) {
    console.log(request.body);

    request.query["purchased"] = "true";
    request.query["uname"] = request.body["uname"];
    request.redirect('products_store.html?' + qs.stringify(request.query));
});
app.post('/process_register', function (req, res) {
    response.send(request.body);
});

app.use(express.static('./static'));

var listener = app.listen(8080, ()=> {console.log ('server started listening on port'+listener.address().port)});
