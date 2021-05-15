// This function asks the server for a "service" and converts the response to text. 
function loadJSON(service, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function nav_bar(this_product_key, myproducts_data) {
  // This makes a navigation bar to other product pages
  for (let products_key in myproducts_data) {
      if (products_key == this_product_key) continue;
        document.write(`<a href='./products_display.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;`);
      }
  }

function getCookie(na_me) {
    var name = na_me + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var dc = decodedCookie.split(';');
    for(var i = 0; i <dc.length; i++) {
      var c = dc[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }