// Reference from Assignment 3 Code Example
// Set up mail server. Only will work on UH Network due to security restrictions
const nodemailer = require("nodemailer");

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
  html: invoice_str,

};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    invoice_str += '<br> There was an error and your invoice could not be emailed';
  } else {
    invoice_str += `<br> Your invoice was mailed to ${user_email}`;
  }
  res.send(invoice_str);
});
// 不是