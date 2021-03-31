var express = require('express');
var app = express();
var myParser =require("body-parser");
var fs =require('fs');
var data=require('./Products.json');
const { request } = require('node:http');
var products =data.products;

app.all('*', function(require, response,next) {
    console.log(request.method+'to' + request.path);
    next();
});

app.use(myParser.urlencoded({extended:true}));
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegInt(q, returnErrors =false) {
    errors = [] 
    if (Number(q) != q) errors.push( 'Not a number! ');
    if (q <0) errors.push( 'Negative value!');
    if (parseInt(q) !=q) errors.push('Not an integer!');
    return returnErrors? errors: (errors. length == 0);
}

function process_quantity_form (POST, response) {
    if (typeof POST ['purchase_submit_button'] != 'undefined') {

    }
}