const fs = require('fs')

var fileName = 'phone.dat'
var fileBuffer = fs.readFileSync(fileName);

var head = fileBuffer.slice(0,10);
console.log(head);
console.log(head.toString('utf8'));

var len = head.length;
console.log('len:'+len);
var body = fileBuffer.slice(100000,100200);
console.log(body.toString('ascii',0,9));
