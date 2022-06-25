var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    //const msg = JSON.parse(rawMsg);
    console.log(msg);
    if(msg==="space") {
        let example = ['2.0','2.1'];
        console.log('sending space',example, +new Date());
        ws.send(JSON.stringify(example));
    }
    if(msg.substr(0,4)==="send") {
        // todo: voting
        try {
            let minput = msg.substr(4,msg.length);
            let obj = JSON.parse(minput); 
            console.log('verifying signature..',obj, +new Date());
            ws.send(JSON.stringify("OK"));
        } catch(err) {
            console.error(String(err));
        }
    }
    if(msg.substr(0,8)==="balance:") {
        let example = 210000000;
        let minput = msg.substr(8,msg.length);
        console.log('retrieving balance from account: ',minput,'-',example, +new Date());
        ws.send(JSON.stringify(example));
    }
  });
});

app.listen(3000);
