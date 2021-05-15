//Borrowed and modified from examples given by DAN PORT in Lab13, LAb 14 and Lab15 and with help from w3schools, as example code and as2 screencaast 
// In order to load the product data
var products_data = require('./products.js');
var productslist = products_data.productslist
const nodemailer = require('nodemailer');
const queryString = require('qs');
//Set up for express
var express = require('express');
var app = express();
var myParser = require("body-parser");
var filename = './user_data.json';
var fs = require('fs');
// Cookies and Session
const { req, res } = require('express');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
now = new Date();
var session = require('express-session');
app.use(myParser.urlencoded({ extended: true }));

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));


// app.all, example from As3 code example
app.all('*', function (req, res, next) {
  console.log(req.method + ' to ' + req.path);
  if(typeof req.session.cart == 'undefined') { req.session.cart = {}; } 
  next();
});

// this process the shopping cart (code from as3 example)
app.get("/add_shoppingcart", function (req, res) {
  var products_key = req.query['products_key']; // get the product key sent from the form post
  var quantities = req.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
  req.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
  res.redirect('./cart.html');
});// 不是 fixed

app.get("/placeorder", function (req, res, next) {
  console.log(req.body);
  // send user to the invice.html if they login
  //send them to the login.html if they is not login
  if (typeof req.cookies['the_username'] != 'undefined') {
    res.redirect('/invoice3.html?' + queryString.stringify(req.query));
  } else {
    res.redirect('/login.html?' + queryString.stringify(req.query));
  }
});
//不是

// this process the get cart(code from as3 example)
app.post("/get_shoppingcart", function (req, res) {
  res.json(req.session.cart);
});

// to get products data
app.post("/get_data", function (req, res) {
  res.json(myproducts_data);
});


//For new user
if (fs.existsSync(filename)) {
  var data = fs.readFileSync(filename, 'utf-8');
  var user_data = JSON.parse(data);

} else {
  console.log(`${filename} does not exist!`);
}


//this process the login form
app.post("/process_login", function (req, res) {

  var theusername = req.body.username.toLowerCase(); //username in lowercase

  if (typeof user_data[theusername] != 'undefined') { //matching username
    if (user_data[theusername].password == req.body.password) { //if all the info is correct, then redirect to the invoice page
      res.redirect('/invoice3.html?' + queryString.stringify(req.query));

      res.cookie('uname', theusername, { maxAge: 1000 * 60 * 10 });
     

    } else { //if the pw has error, push an error
      req.query.username = theusername;
      req.query.LoginError = 'Invalid Password';
    }


  } else { //if the username has error, push an error 
    req.query.LoginError = 'Invalid Username';
  }
  console.log('./login.html?' + queryString.stringify(req.query));
  res.redirect('./login.html?' + queryString.stringify(req.query));//redurect to login page
});

// this process the logout form
app.get("/logout", function (req, res) {
  str = `<script>alert('Successfully logged out!'); location.href="./index.html";</script>`;
  res.clearCookie('username');
  res.send(str); 
    req.session.destroy();
    res.redirect('./index.html');
});//不是 fixed

//this process the register form
app.post("/process_register", function (req, res) {

  reusername = req.body["username"];
  user_data[reusername] = {};
  user_data[reusername]["name"] = req.body['fullname'];
  user_data[reusername]["password"] = req.body['password'];
  user_data[reusername]["email"] = req.body['email'];
// Check if the username is taken
  var regu = req.body.username.toLowerCase(); 
  if (typeof user_data[regu] != 'undefined') { // Output errors if name is taken
      errors.push('Sorry! That username is taken.') 
  }
  res.cookie("username", reusername); // Remember username
  res.cookie("name", registered_name); // Remember name
  res.cookie("email", req.body.email); // Remember email
  res.redirect('./index.html');
  fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
  res.redirect('/invoice3.html?' + queryString.stringify(req.query));

});

//For Purchase (shopping cart)
app.post("/process_purchase", function (req, res) { //Processing the purchase and rendering the invoice on the server
  let POST = req.body;
  console.log(POST)

  if (typeof POST['purchase_submit'] != 'undefined') { //if quantities are invaild
    var hasvalidquantities = true;
    var hasquantities = false
    for (i = 0; i < data.products.length; i++) {
      qty = POST[`quantity${i}`];
      hasquantities = hasquantities || qty > 0; // is valid if value > 0
      hasvalidquantities = hasvalidquantities && isNonNegInt(qty);  // is valid if both > 0  
    }

    // if quantity is invalid, redirect to products display page
    const stringified = queryString.stringify(POST);
    if (hasvalidquantities && hasquantities) {
      res.redirect("./login.html?" + stringified);// if quantity is valid, redirect to login page
      return;
    }
    else {
      res.redirect("./products_display.html?" + stringified)
    }
  }
});//卡?

app.get("/checkout", function (req, res) {
  var shop_cart = req.session.cart;
  var username = req.cookies['the_username'];
  invoice_str = `
`});//卡

app.post("/complete_invoice", function (req, res) {
  var str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
  var shopping_cart = req.session.cart;
  
  for(products in productslist) {
    for(i=0; i<productslist[products].length; i++) {
        if(typeof shopping_cart[products] == 'undefined') continue;
        quantities = shopping_cart[products][i];
        if(quantities > 0) {
          str += `<tr><td>${quantities}</td><td>${productslist[products][i].name}</td><tr>`;
        }
    }
}
  cart = JSON.parse(req.query['CartData']);
  cookie = JSON.parse(req.query['CookieData']);
  var email = user_data[req.cookies.username].email;

  str = `
  <link href="Products-style.css" rel="stylesheet">
  <h1 style="font-size:50px"> Thank You for Your Order at Xinfei's Marketplace! </h1>
  <br><b>An email has been sent to ${email}.</b></br>
  br><b><a href="/logout">Logout My Account)</a></b></br>

<table id='invoice3' border="2">
      <tbody>
        <tr>
          <th style="text-align: center;" width="43%">name</th>
          <th style="text-align: center;" width="11%">quantity</th>
          <th style="text-align: center;" width="13%">price</th>
          <th style="text-align: center;" width="54%">extended price</th>
        </tr>
`});

                str +=` <tr>
                <td width="43%">${productslist[products][i].name}</td>
                <td align="center" width="11%">${quantities}</td>
                <td width="13%">$${productslist[products][i].price}</td>
                <td width="54%">$${extended_price.toFixed(2)}</td>
      </tr>
      `;
            
      
    
     //compute tax
     var tax_rate = 0.045
     var tax = tax_rate*subtotal;

     //compute shipping
     if(subtotal <=1000) {
       shipping =50;
     }
    else if(subtotal <=50000){
      shipping = 100;
    }
    else{
      shipping = 0.05*subtotal; // 5% of subtotal
    }
     //compute grant total
     var total = subtotal + tax + shipping;

     str += `
<tr>
  <td colspan="4" width="100%">&nbsp;</td>
</tr>
<tr>
  <td style="text-align: center;font-family: Garamond;" colspan="3" width="67%">Subtotal</td>
  <td width="54%">$${subtotal.toFixed(2)}</td>
</tr>
<tr>
<td style="text-align: center;font-family: Garamond;" colspan="3" width="67%">Tax @ ${(tax_rate*100).toFixed(3)}%</span></td>
<td width="54%">$${tax.toFixed(2)}</td>
</tr>
<td style="text-align: center; font-family: Garamond;" colspan="3" width="67%">Shipping</span></td>
<td width="54%">$${shipping.toFixed(2)}</td>
</tr>
<tr>
  <td style="text-align: center;font-family: Garamond;" colspan="3" width="67%"><strong>Total</strong></td>
  <td width="54%"><strong>$${total.toFixed(2)}</strong></td>
</tr>
      </tbody>

    </table>`;
// Reference from Assignment 3 Code Example
// Set up mail server. Only will work on UH Network due to security restrictions


var transporter = nodemailer.createTransport({
  host: "mail.hawaii.edu",
  port: 25,
  secure: false, // use TLS
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

var user_email = user_data[req.cookies['the_username']]['email'];
var mailOptions = {
  from: 'xinfeili@hawaii.edu',
  to: user_email,
  subject: 'Thank You For Place Your Order At Xinfei Marketplace',
  html: str

};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error); // report any errors to the console
}
else {
    console.log('Email sent: ' + info.res); // otherwise aknowldge that the email has been sent
}
});
res.send(str); // display string in browser
;
// 不是



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
app.listen(8080, () => console.log(`listening on port 8080`));// sets express to listen on port 8080