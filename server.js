//Borrowed and modified from examples given by DAN PORT in Lab13 and Lab14 and with help from w3schools, as2 screencaast and Chole Cheng
var data = require('./static/products');
var products = data.products;
const queryString = require('qs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var filename = 'user_data.json';
var fs = require('fs');
const { request, response } = require('express');


app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.use(myParser.urlencoded({ extended: true }));

if (fs.existsSync(filename)) {
  data = fs.readFileSync(filename, 'utf-8');
  user_data = JSON.parse(data);

} else {
  console.log(filename + ' does not exist!');
}


//this process the login form
app.post("/process_login", function (req, res) {

  var the_username = req.body.username.toLowerCase(); //username in lowercase

  if (typeof user_data[the_username] != 'undefined') { //matching username
    if (user_data[the_username].password == req.body.password) { //if all the info is correct, then redirect to the invoice page
      res.redirect('/invoice3.html' + queryString.stringify(req.query));
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
  qstr = req.body
  console.log(qstr);
  var errors = [];

  if (/^[A-Za-z]+$/.test(req.body.name)) { //setup for name limitations
  }
  else {
    errors.push('Use Only Letters for Fullname')
  }

  if (req.body.name == "") {
    errors.push('Invalid Fullname');// if full name is invalid
  }

  if ((req.body.fullname.length > 10 && req.body.fullname.length < 0)) {
    errors.push('Fullname Length Too Long')// fullname length :0-10
  }

  var reguser = req.body.username.toLowerCase(); //username in lowercase
  if (typeof user_data[reguser] != 'undefined') {// if username is invalid
    errors.push('Username is taken! Try again')
  }

  if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {//username can be only letter and number
  }
  else {
    errors.push('Username Only Can Be Letters And Numbers')
  }


  if (req.body.password.length < 6) {//password length: 6 characters or more
    errors.push('Password Need To Be At Least 6 Characters and/or Numbers')
  }

  if (req.body.password !== req.body.repeat_password) {  // matching password
    errors.push('Password Does Not Match')
  }

  //request basic info
  req.query.fullname = req.body.fullname;
  req.query.username = req.body.username;
  req.query.email = req.body.email;

  if (errors.length == 0) { // Save user's register information if no error
    POST = req.body
    console.log('no errors')
    var username = POST['username']
    user_data[username] = {};
    user_data[username].name = req.body.fullname;
    user_data[username].password = req.body.password;
    user_data[username].email = req.body.email;
    data = JSON.stringify(user_data);
    fs.writeFileSync(filename, data, "utf-8");
    response.redirect('./invoice3.html?' + queryString.stringify(req.query));
  }

  else { //check to see if the error occurs 
    console.log(errors)
    req.query.errors = errors.join(';');
    res.redirect('register.html?' + queryString.stringify(req.query));//redirect to register page
  }
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