(async function() { // async wrapper start + 
try {
const crypto = require("crypto");
const nacl = require('tweetnacl');

// convert functions
function toHex(bufferOrStr) {
    return Buffer.from(bufferOrStr).toString('hex'); 
}

function bufferToString(buffer) {
    return Buffer.from(buffer).toString(); 
}

function hexToU8Array(hexStr) {
    return Uint8Array.from(Buffer.from(hexStr, 'hex'));
}


// wallet functions
async function getKeys() {
  	const seed = crypto.randomBytes(32);
  	return getKeysBySeed(seed);
}

async function getKeysBySeed(seed) {
    const keypair = nacl.sign.keyPair.fromSeed(seed);
  	const boxKeypair = nacl.box.keyPair.fromSecretKey(seed);
    let address = toHex(keypair.publicKey) + '.' + toHex(boxKeypair.publicKey);
  	return {
      		seed:toHex(seed),
      		address: address,
            sign_public:toHex(keypair.publicKey),
            sign_secret:toHex(keypair.secretKey),
            enc_public:toHex(boxKeypair.publicKey),
            enc_secret:toHex(boxKeypair.secretKey),
           };
}

let freshKeypair = await getKeys();
console.log('keys',freshKeypair);





// sign functions 
async function sign(messageHex,secretKeyHex) {
          let message = hexToU8Array(messageHex);
          let secretKey = hexToU8Array(secretKeyHex);
          let signed = nacl.sign(message, secretKey);
          return toHex(signed);
  }
    function verify(signatureHex,messageHex,publicKeyHex) {
            let signature = hexToU8Array(signatureHex);
            let message = hexToU8Array(messageHex);
            let publicKey = hexToU8Array(publicKeyHex);
            let open = nacl.sign.open(signature, publicKey); 
            let check = JSON.stringify(open) === JSON.stringify(message); // all buffers
            return check;
    }

	// simply signing a hex value
	let signature = await  sign(freshKeypair.sign_public,freshKeypair.sign_secret);
    console.log('signature',signature);
    let match = await verify(signature,freshKeypair.sign_public,freshKeypair.sign_public);
    console.log(match);

function encrypt(messageHex,theirPublicKey,mySecretKey,randomBytes=24) {
  	let nonce = crypto.randomBytes(randomBytes);
    let box = nacl.box(hexToU8Array(messageHex), nonce, hexToU8Array(theirPublicKey), hexToU8Array(mySecretKey));
	return  toHex(nonce) + '.' + toHex(box);
}

function decrypt(nonceHex,boxHex,theirPublicKey,mySecretKey) {
  	let box = hexToU8Array(boxHex);
  	let nonce = hexToU8Array(nonceHex);
	return nacl.box.open(box, nonce, hexToU8Array(theirPublicKey), hexToU8Array(mySecretKey));
}

let freshKeypair2 = await getKeys();
console.log('keys2',freshKeypair2);

// simple hex encryption
let messageHex = toHex('hello world');
let boxNonceHex = encrypt(messageHex, freshKeypair2.enc_public, freshKeypair.enc_secret);
console.log("encrypted", boxNonceHex);

let nonceFromHex = boxNonceHex.split('.')[0];
let boxFromHex = boxNonceHex.split('.')[1];
let decrypted = decrypt(nonceFromHex,boxFromHex, freshKeypair2.enc_public, freshKeypair.enc_secret);
console.log("decrypted",bufferToString(decrypted));
process.exit(0); // close script
 } catch(err) { console.log(err);process.exit(1);}
})() // async wrapper end;