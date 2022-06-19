# X-node-js
X: Simply The Best Possible Digital Currency with Zero Fees. Supports Multiple Coins. Real Decentralization. Real Security. Real Transparency. Run Your Own Coin Network or Join Ours.

(Currently in initial testing/play phase, testnet launching as soon as possible) 

Join us on Reddit for Daily Updates: https://www.reddit.com/r/xcurrencyecosystem

#### Test the Crypto Playground (wallet creation, sign and encrypt)
Main question: Are we going for one key (simple) or two keys (possibly safer)?

```
node tests/cryptoplayground/1key.js
node tests/cryptoplayground/2keys.js
```

To quote TweetNacl/ed2curve.js author:
"Note that there's currently [no proof](http://crypto.stackexchange.com/a/3311/291)
that this is safe to do. It is safer to share both Ed25519 and Curve25519
public keys (their concatenation is 64 bytes long)."

#### Test the X Ledger Sun & Moon Grid!

![sunmoon](tests/sun-and-moon-ledger/sunandmoon.png)

```
cd tests/sun-and-moon-ledger/
node index.js
```

