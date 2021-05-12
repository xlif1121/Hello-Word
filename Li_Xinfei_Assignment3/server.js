//Borrowed and modified from examples given by DAN PORT in Lab13, LAb 14 and Lab15 and with help from w3schools, and as2 screencaast 
var data = require('./static/products');
var products = data.products;
const queryString = require('qs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var filename = './user_data.json';
var fs = require('fs');
const { request, response } = require('express');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
now = new Date();
var session = require('express-session');

app.use(session({ secret: "ITM352 rocks!" }));


// Play with sessions
app.get('/set_session', function (req, res, next) {
  res.send(`Welcome, your session ID is ${req.session.id}`);
  req.session.destroy();
  next();
});


// Play with cookies
app.get('/set_cookie', function (req, res, next) {
  // console.log(req.cookies);
  let my_name = 'Xinfei Li';
  res.cookie('my_name', my_name, { expire: 5000 + now.getTime() }); // cookie expires in 5 seconds
  // res.clearCookie('my_name');
  res.cookie('my_name', my_name);
  res.send(`Cookie for ${my_name} sent`);
  next();
});


// Play with cookies
app.get('/use_cookie', function (req, res, next) {
  // console.log(req.cookie);
  if (typeof req.cookies["my_name"] != 'undefined') {
    res.send(`Hello ${req.cookies["my_name"]} is logged in!`);
  } else {
    res.send("You are not logged in!");
  }
  next();
});


// app.all 
app.all('*', function (request, response, next) {
  //console.log(request);
  console.log(request.method + ' to ' + request.path);
  next();
});

app.use(myParser.urlencoded({ extended: true }));

if (fs.existsSync(filename)) {
  var data = fs.readFileSync(filename, 'utf-8');
  var user_data = JSON.parse(data);

} else {
  console.log(`${filename} does not exist!`);
}


//this process the login form
app.post("/process_login", function (req, res) {
  if (typeof req.session['last_login'] != 'undefined') {
    last_log='This is Your Last login time' + req.session['last_login'];
  }
  else {
    last_log="First Time Login";
  }
  req.session['last_login'] = Date();

  

  var the_username = req.body.username.toLowerCase(); //username in lowercase

  if (typeof user_data[the_username] != 'undefined') { //matching username
    if (user_data[the_username].password == req.body.password) { //if all the info is correct, then redirect to the invoice page
      res.redirect('/invoice3.html?' + queryString.stringify(req.query));
      return;

    } else { //if the pw has error, push an error
      req.query.username = the_username;
      req.query.LoginError = 'Invalid Password';
    }
  } else { //if the username has error, push an error 
    req.query.LoginError = 'Invalid Username';
  }
  console.log('./login.html?' + queryString.stringify(req.query));
  res.redirect('./login.html?' + queryString.stringify(req.query));//redurect to login page
});

//this process the register form
app.post("/process_register", function (req, res) {

  username = req.body["username"];
  user_data[username] = {};
  user_data[username]["name"] = req.body['fullname'];
  user_data[username]["password"] = req.body['password'];
  user_data[username]["email"] = req.body['email'];


  fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
  res.redirect('/invoice3.html?' + queryString.stringify(req.query));

});


app.post("/process_purchase", function (request, response) { //Processing the purchase and rendering the invoice on the server
  let POST = request.body;
  console.log(POST)

  if (typeof POST['purchase_submit'] != 'undefined') { //if quantities are invaild
    var hasvalidquantities = true;
    var hasquantities = false
    for (i = 0; i < products.length; i++) {
      qty = POST[`quantity${i}`];
      hasquantities = hasquantities || qty > 0; // is valid if value > 0
      hasvalidquantities = hasvalidquantities && isNonNegInt(qty);  // is valid if both > 0  
    }
    // if quantity is invalid, redirect to products display page
    const stringified = queryString.stringify(POST);
    if (hasvalidquantities && hasquantities) {
      response.redirect("./login.html?" + stringified);// if quantity is valid, redirect to login page
      return;
    }
    else {
      response.redirect("./products_display.html?" + stringified)
    }
  }
});

function isNonNegInt(q, returnErrors = false) { //Check if quantity is valid or not
  errors = [];
  if (q == "") q = 0; //if nothing in the text box, show nothing
  if (Number(q) != q) errors.push('Not a number!'); // Check to see if string is a number
  else if (q < 0) errors.push('Negative value!'); //Check to see if value is positive
  else if (parseInt(q) != q) errors.push('Not an integer!'); //Check to see if value is an integer
  return returnErrors ? errors : (errors.length == 0);
}

//class server
app.use(express.static('./static'));
var listener = app.listen(8080, () => { console.log(`listening on port ` + listener.address().port) });