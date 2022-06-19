(async function() { // async wrapper start + 
try {
const crypto = require("crypto");
const nacl = require('tweetnacl');
const ed2curve = require('ed2curve');

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
// Generate new sign key pair.
let seed = new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]);
var myKeyPair = nacl.sign.keyPair.fromSeed(seed);

// Share public key with a peer.
console.log("X Wallet (1 key)", {
            "seed":toHex(seed),
            "public":toHex(myKeyPair.publicKey),
            "secret":toHex(myKeyPair.secretKey),
});

// Receive peer's public key.
var myKeyPair2 = nacl.sign.keyPair();
var theirPublicKey = myKeyPair2.publicKey; // ... receive

// Sign a message for them.
var message = hexToU8Array(toHex('Hello!'));
var signedMessage = toHex(nacl.sign(message, myKeyPair.secretKey));
console.log("signed message", signedMessage);

// Send message to peer. They can now verify it using
// the previously shared public key (myKeyPair.publicKey).
// ...

// Receive a signed message from peer and verify it using their public key.
var theirMessage = nacl.sign.open(hexToU8Array(signedMessage), myKeyPair.publicKey);
let check = JSON.stringify(theirMessage) === JSON.stringify(message); // all buffers
console.log('check',(check));

// Encrypt a message to their public key.
// But first, we need to convert our secret key and their public key
// from Ed25519 into the format accepted by Curve25519.
//
// Note that peers are not involved in this conversion -- all they need
// to know is the signing public key that we already shared with them.

var theirDHPublicKey = ed2curve.convertPublicKey(theirPublicKey);
var myDHSecretKey = ed2curve.convertSecretKey(myKeyPair.secretKey);

var anotherMessage = hexToU8Array(toHex('Keep secret'));
var nonce = crypto.randomBytes(24);
var encryptedMessage = nacl.box(anotherMessage, nonce, theirDHPublicKey, myDHSecretKey);

// When we receive encrypted messages from peers,
// we need to use converted keys to open them.

var decryptedMessage = nacl.box.open(encryptedMessage, nonce, theirDHPublicKey, myDHSecretKey);
console.log("decryptedMessage",bufferToString(decryptedMessage));
process.exit(0); // close script
 } catch(err) { console.log(err);process.exit(1);}
})() // async wrapper end;