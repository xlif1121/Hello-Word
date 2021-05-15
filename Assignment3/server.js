var express = require('express');
var app = express();
var myParser = require("body-parser");
var session = require('express-session');
var products_data = require('./products.json');
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');
var cookieParser = require('cookie-parser');
const { response } = require('express');
app.use(cookieParser());


// play with cookies  from lab 15
app.get('/set_cookie', function (req, res, next) {
    // console.log(req.cookies);
    let my_name = 'Max Burman';
    res.clearCookie('my_name');
    now = new Date();
    res.send(`Cookie for ${my_name} sent`);
    next();
});

// Play with cookies from lab 15
app.get('/use_cookie', function (req, res, next) {
    // console.log(req.cookie);
    if (typeof req.cookies["my_name"] != 'undefined') {
        let username = req.cookies["username"];
        res.send(`${user_data[username]["name"]} is logged in!`);
    } else {
        res.send("You are not logged in!");
    }
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.use(session({ secret: "ITM352 rocks!" }));

app.all('*', function (request, response, next) {
    console.log(`Got a ${request.method} to path ${request.path}`);
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
    next();
});

app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

app.post("/get_cart_data", function (request, response) {
    response.json(request.session.cart);
});

// this is copied from the example on the class website
app.get("/add_to_cart", function (request, response) {
    console.log(request.query);
    var products_key = request.query['product_type']; // get the product key sent from the form post
    request.session.cart[products_key] = request.query['quantity']; // store the quantities array in the session cart object with the same products_key. 
   // if(request.query ['username']) { // change so that if the person is logged in then take them to the cart
   console.log(request.session.cart); 
   response.redirect('./cart.html');
   // }
});
// this is taken from class and takes the quantities selected that is in the session
// copied from the in class examples from the class website

app.get('/checkout', function (request, response){
    // create the invoice
    invoice_string = `
    <table border="2" class="center">
    <tbody>
      <tr>
        <th style="text-align: center;" width="25%">Item</th>
        <th style="text-align: center;" width="11%">quantity</th>
        <th style="text-align: center;" width="25%">price</th>
        <th style="text-align: center;" width="20%">extended price</th>
      </tr>
      `;

        subtotal = 0;
        cart_data = request.session.cart;
        for (prod_key in cart_data) {
          var products = products_data[prod_key];
          for (prod_size in cart_data[prod_key]) {
            for (i in cart_data[prod_key][prod_size]) {
              let qty = cart_data[prod_key][prod_size][i];
              if (qty > 0) {
                extended_price = qty * products[i].price;
                subtotal += extended_price;
                // this is for quantities in the small size
                invoice_string += `
              <tr>
                <td width="43%">${(prod_size != 'any')? prod_size:''} ${products[i].item}</td>
                <td align="center" width="11%"> ${qty}</td>
                <td width="13%"> $${products[i].price}</td>
                <td width="54%"> $${extended_price}</td>
              </tr>
              `;
              }
            }
          }
        }
          // this code is similar to what we did in invoice 4 and i modified it a bit to fit for the clothing store better
          // compute tax
          var tax_rate = 0.04; // 4% is the sales tax in hawaii 
          var tax = tax_rate * subtotal
          // Compute shipping
          if (subtotal <= 25) {
            shipping = 2;
          }
          else if (subtotal <= 50) {
            shipping = 5;
          }
          else {
            shipping = 0.05 * subtotal;
          }
          // compute total 
          var total = subtotal + tax + shipping;
        //this is copied from the invoice wod, I have modified it a little bit, below is to print out the subtotal, the tax, the shipping and the total price
      invoice_string += `<tr>
        <td colspan="4" width="100%">&nbsp;</td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
        <td width="54%">$
          ${subtotal}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @ 4%</span>
        </td>
        <td width="54%">$
          ${tax.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Shipping</span></td>
        <td width="54%">$
          ${shipping.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
        <td width="54%"><strong>$
            ${total.toFixed(2)}
          </strong></td>
      </tr>
    </tbody>
  </table>
  <h2>
  Thank you
 ${request.cookies['username']} for shopping at Max's T-shirt shop!
  Your invoice will be sent to
  ${'email'}
</h2>
<form action="process_logout" method="get">
 <button type="submit">Log out</button>
  `;

  response.send(invoice_string);
});

var user_data_file = './user_data.json';
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${file_stats["size"]} characters in it`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`)
}

app.all('*', function (request, response, next) {
    console.log(request.method, request.path);
    next();
});

app.post('/process_register', function (request, response) {
    // add a new user to the database
    username = request.body.username; // check that the username is not taken, if it is make them sart over
    var errors = {};
    if (typeof user_data[username] != 'undefined') { // check that the new username is not already taken
        errors["username_error"] = "username is taken";
    }
    // check if password and repeat password match
    if (request.body.password != request.body['password-repeat']) {
        errors["password_match_error"] = "Password does not match";
    }
    if (Object.keys(errors).length > 0) {
        response.redirect("./register.html?" + qs.stringify(request.query) + "&" + qs.stringify(errors));
    } else {
        // all good add to database
        user_data[username] = {};
        user_data[username].password = request.body["password"]; // check that the password mathces the re-entered password
        user_data[username].email = request.body["email"];
        user_data[username].name = request.body["fullname"];
        // save the new user in to the database by writing it in to the database file
        fs.writeFileSync(user_data_file, JSON.stringify(user_data));
        request.query.email = request.body.email;
        request.query.username = request.body.username;
        response.redirect("./invoice.html?" + qs.stringify(request.query));

    }
    request.query["register_error"] = error;
    response.redirect('register.html?' + qs.stringify(request.query));
});


// this processes the login form
app.post('/process_login', function (request, response, next) {
    // check login and password match database
    console.log(request.body);
    let username_entered = request.body.username;
    let password_entered = request.body.password;
    if (typeof user_data[username_entered] != 'undefined') { // Here i am checking if what the usename entered fits with the use_data.json and seeing if there is a match to the username in the database.
        if (user_data[username_entered]['password'] == password_entered) {
            // all good send to invoice with username
            request.query["username"] = username_entered;
            request.query["email"] = user_data[username_entered]['email'];
            response.cookie('username', username_entered);
            response.redirect('invoice.html?' + qs.stringify(request.query)); // if the login is successful this takes you to the invoice with the quantities that you have selected
        } else {
            var error = "password_error";
        }
    } else {
        var error = "username_error";
    }
    request.query["login_error"] = error;
    response.redirect('login_page.html?' + qs.stringify(request.query));
});

//logut deleting the session
app.get("/process_logout", function (request, response) { 
    request.session = null; // delete the session 
    response.redirect('index.html');
});


// this processes the login form
app.post('/process_register', function (request, response, next) {
    response.send(request.body)
});


app.use(express.static('./static'));
app.listen(8080, () => console.log(`listening on port 8080`));