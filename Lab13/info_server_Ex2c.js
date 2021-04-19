var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs')
app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path +'with query' +JSON.stringify);
});

app.get('/test', function (request, response, next) {
    response.send('I got a request for /test');
});

app.post('/display_purchase', function (request, response, next) {
    user_data={'username':'itm352','password':'mis'};
    post_data=request.body;
    if(post_data['quantity_textbox']) {
        the_qty = post_data['quantity_textbox'];
        if(user_data['username'] == post_data['username_textbox']) {
            
        }
        if(isNonNegInt(the_qty)) {
            qstring=qs.stringify(request.query);
            response.redirect('invoice.html?quantity_textbox'+qstring+ '&quantity_textbox='+the_qty);
            return;
        }else{
            response.redirect('./order_page_Ex3.html?quantity_textbox'+the_qty);
            return;
         }
    }
});

app.use(express.static('./public'));

app.listen(8080, function () {
console.log(`listening on port 8080`)
}
);// note the use of an anonymous function here

function isNonNegInt (the_qty, returnErrors=false) {
    if(the_qty=='') the_qty=0;
var errors = []; // assume no errors at first
if(Number(the_qty) != the_qty) errors.push('Not a number!'); // Check if string is a number value
if(the_qty < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(the_qty) != the_qty) errors.push('Not an integer!'); // Check that it is an integer

return returnErrors ? errors : (errors.length == 0);

}