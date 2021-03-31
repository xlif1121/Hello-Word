function isNonNegInt (q, returnErrors=false) {
    errors = []; // assume no errors at first
if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

return returnErrors ? errors : (errors.length == 0);

}

console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);

attributes  =  "Xinfei;20;FIN&MIS";
parts = attributes.split(";");

attributes  =  "Xinfei;20;20+ 0.5;0.5 - 20" ;

for(part of parts) {
    console.log(isNoNegInt(part, true));
}
//console.log(parts);