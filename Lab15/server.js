// Setup server
var express = require('express');
var app = express();
var myParser = require('body-parser')
app.use(myParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var fs  = require('fs')

// play with cookies
app.get('/set_cookie', function (req, res, next) {
    //console.log(req.cookies);
    let my_name='Xinfei Li';
    res.clearCookie('my_name',my_name,{exp});
    res.cookie('my_name')
    next();
});

// play with cookies
app.get('/use_cookie', function (req, res, next) {
    //console.log(req.cookies);
    if(typeof req.cookie["my_name"] !='undefined') {
    res.send(`Hello ${req.cookies["my_name"]}!`);
}else{
    res.send("I don't know you!")
}
 
    next();
});
// read user data file
var user_data_file = './user_data.json';
if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${["size"]}`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
}
else {
    console.log(`${user_data_file} does not exist!`)
}

app.all('*', function (request, response, next) {
    console.log(req);
    console.log(request.method + request.path);
    next();
});

app.post('/process_register', function(req, res) {
    // add a new user to the database
    username = req.body["uname"];
    user_data[username] = {};
    user_data[username]["password"] = req.body["psw"];
    user_data[username]["email"] = req.body["email"];
    user_data[username]["name"] = req.body["fullname"];

    // save updated user_data to file
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    res.send(`${username} is registered!`);
});


console.log(user_data);

app.get("/login", function (request, response) {

    // Give a simple login form
    str = `
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    app.post('/process_login', function (request, response, next) {
        let username_entered = request.body["uname"];
        let password_entered = request.body["pword"];
        if(typeof user_data[username_entered] != 'undefined') {
            if(user_data[username_entered]['password'] == password_entered) {
                    response.send(`${username_entered} is logged in.`);
            }
            else {
                response.send(`${username_entered} is wrong`);
            }
        }
        else {
            response.send(`${username} entered not found.`);
        }
    });
});



app.use(express.static('./public')); // use express.static

app.listen(8080, () => console.log(`listening on port 8080`)); // output to console the port we are listening in on