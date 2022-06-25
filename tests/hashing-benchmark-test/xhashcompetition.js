(async function() { // async wrapper start + 
try {
const crypto = require("crypto");
const blake = require("blakejs"); 

function xhashtest() {
  let data = Buffer.from("abcdefghijklmnopqrstuvwxyz");
  return crypto.createHash('sha512').update(data).digest('hex').substr(0,96);
}

// note: this is not exactly how nano does it but should give you some idea
function nanohashtest() {
  return blake.blake2bHex("abcdefghijklmnopqrstuvwxyz");
}

// note: this is not exactly how bitcoin does it but should give you some idea
function btchashtest() {
  let data = Buffer.from("abcdefghijklmnopqrstuvwxyz");
  let data1 = crypto.createHash('sha256').update(data).digest("bytes");
  return crypto.createHash('sha256').update(data1).digest('hex');
}



let rounds = 60000;
let startx = +new Date();
for(let i=0;i<rounds;i++) {
 	 xhashtest();
}
let endx = +new Date();
console.log("time for x (trunc. sha512)", endx-startx);


let startbtc = +new Date();
for(let i=0;i<rounds;i++) {
 	 btchashtest();
}
let endbtc = +new Date();
console.log("time for btc (2x sha256)", endbtc-startbtc);

let startnano = +new Date();
for(let i=0;i<rounds;i++) {
 	 nanohashtest();
}
let endnano = +new Date();
console.log("ti nano blake (blake2b)", endnano-startnano);
process.exit(0); // close script
 } catch(err) { console.log(err);process.exit(1);}
})() // async wrapper end;