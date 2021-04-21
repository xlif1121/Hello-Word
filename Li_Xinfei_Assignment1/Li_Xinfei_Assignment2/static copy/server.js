//Borrowed and modified from Lab 14 and Assignment1, modified template from ww3schools.com
var data = require('./public/products_data.js')
var products = data.products;
const queryString = require('query-string');
var myParser = require('body-parser')
var express = require('express');
var app = express();
var fs  = require('fs')

// Setup app.all
app.all('*', function (req, res, next) {
    console.log(req.method + ' to ' + req.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

// Set userData equal to user_data.json
var userData = './user_data.json'; 

// Code from Lab14, modified for Assignment2
if(fs.existsSync(userData)) { 
    var file_stats = fs.statSync(userData);
    console.log(`${userData} has ${file_stats.size} characters.`);
    data = fs.readFileSync(userData, 'utf-8');
    users_reg_data = JSON.parse(data);
}
else {
    console.log(`${userData} does not exist!`)
}

app.post('/process_login', function (req, res) {
    var LogError = [];
    console.log(req.query);
    username = req.body.username.toLowerCase();
   
    if (typeof users_reg_data[username] != 'undefined') {
   
        if (users_reg_data[username].password == req.body.password) {
            req.query.username = username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name;
            res.redirect('./invoice.html?' + queryString.stringify(req.query));
            return;
        }
 
        else {
            LogError.push = ('Sorry, but the password you inputted is invalid!'); 
            console.log(LogError);
            req.query.username = username;
            req.query.name = users_reg_data[username].name;
            req.query.LogError = LogError.join(';');
        }
    }
    // Else push an error
    else {
        LogError.push = ('Sorry, but the username you inputted is invalid!'); 
        console.log(LogError);
        req.query.username = username;
        req.query.LogError = LogError.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query)); 
});


app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[a-zA-Z]+$/.test(req.body.name)) {
    }
    else {
        errors.push('Please follow the format for names! (ex. John Smith)')
    }

    if (req.body.name == "") {
        errors.push('The full name inputted is invalid.');
    }
  
    if ((req.body.fullname.length > 30 && req.body.fullname.length < 0)){ 
        errors.push('Sorry! That name is too long.')
    }
  
    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { // Output errors if name is taken
        errors.push('Sorry! That username is taken.') 
    }
    // Setup character limitations (Letters and numbers only for username)
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
        errors.push('Please use only letters and numbers for your username.')
    }
  
    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) {
    }
    else {
        errors.push('Please use a valid format email format (ex. johnsmith@gmail.com)')
    }

    // Make password a minimum of six characters
    if (req.body.password.length < 6) {
        errors.push('Your password is too short (Please use at least 6 characters).')
    }
    // Check to see if the passwords match
    if (req.body.password !== req.body.repeat_password) { 
        errors.push('Your password does not match.')
    }

    // Request fullname, username, and email
    req.query.fullname = req.body.fullname;
    req.query.username = req.body.username;
    req.query.email = req.body.email;

    // Remember user information given no errors
    if (errors.length == 0) {
        POST = req.body;
        console.log('no errors');
        var username = POST["username"];
        users_reg_data[username] = {};
        users_reg_data[username].name =  req.body.fullname;
        users_reg_data[username].password =  req.body.password;
        users_reg_data[username].email =  req.body.email;
        data = JSON.stringify(users_reg_data); // Stringify user's info
        fs.writeFileSync(userData, data, "utf-8");
        res.redirect('./invoice.html?' + queryString.stringify(req.query));
    }
    // Check for errors
    else {
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query)); // Redirect to register.html
    }
});

// Derived from Lab 14 and Assigment2 screencast
// Take form and process it given that the information submitted is ok
app.post("/process_purchase", function (req, res) {
    let POST = req.body;
    console.log(POST)
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasValidQty = true; // Assume that quantity is valid
        var hasQty = false;
        for (i = 0; i < products.length; i++) {
            quantity = POST[`quantity${i}`]; // Set QtyCheck equal to POST[`quantity${i}`]
            if (quantity > 0) {
                hasQty = true // Has non-zero quantity
            }
            if (isNonNegInt(quantity) == false) {
                hasValidQty = false // Has both valid quantity and non-negative integer
            }
        }
        // Given the the quantities inputted are valid, redirect the user back to index
        const stringified = queryString.stringify(POST); // If all quantities are valid then go to login.html with query string containing the order quantities
        if (hasValidQty && hasQty) {
            res.redirect("./login.html?" + stringified); // Directs user from products_display.html to login.html with the query string that has the order quantities
        } 
        else { 
            res.redirect("./index.html?" + stringified)
        }
    }
});

// isNonNegInt function from Lab11
// Check to see if the quantity inputted is valid
function isNonNegInt(q, return_errors = false) {
    var errors = []; // Assume no errors at first
    if(q == '') q = 0; // If text box is blank, show nothing
    if (Number(q) != q) errors.push('<font color="red">Please input a number </font>'); // Check if string is a number value
    else {
        if (q < 0) errors.push('<font color="red">Please input a positive quantity </font>'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('<font color="red">Please input a whole number </font>'); // Check that it is an integer
    }
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // Use express.static

app.listen(8080, () => console.log(`
    listening on port 8080
    access here: http://itm-vm.shidler.hawaii.edu:8080/
`)); // Output to console the port we are listening in on