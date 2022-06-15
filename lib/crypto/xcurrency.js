const nanocurrency = require('nanocurrency');
const { GPU } = require('gpu.js');
const gpu = new GPU();

// returns String: work hash
async function computeWorkfn(hash) {
    const work = gpu.createKernel(function() {
        nanocurrency.computeWork(hash).then((pow) => {
            return pow;
        }).catch((err) => {
            return String(err);
        });
      });
    console.log("cool 3",work);
    return work;
}

// returns Boolean: true if valid, false if not
function validateWorkfn(hash,threshold,work) {
    return nanocurrency.validateWork(hash,threshold,work);
}

// return String: hex signature
function signfn(keys,hash) {
    return nanocurrency.signBlock(hash,keys.secret);
}
     
// returns Object: .address='xrb_1..', .keys={seed:'..',private:'..',public:'..'} 
async function generateWalletfn() {
    const seed = await nanocurrency.generateSeed();
    const secret = nanocurrency.deriveSecretKey(seed, 0);
    const public = nanocurrency.derivePublicKey(secret);
    const address = nanocurrency.deriveAddress(public);
    return {address:address, keys: { seed:seed, secret:secret,public:public}};
}

module.exports.sign = function(keys,hash) {
    return signfn(keys,hash);
}

module.exports.validateWork = function(hash,threshold,work) {
    return validateWork(hash,threshold,work);
}

module.exports.computeWork = async function(hash) {
    return await computeWorkfn(hash);
}

module.exports.generateWallet = async function() {
    return await generateWalletfn();
}
