(async function() { 
    try {
        const total_supply = 133200000;
        const coin_id = 993;
        console.log({total_supply:total_supply,coin_id:coin_id});
        const xcurrency = require('./lib/crypto/xcurrency')

        async function generateBlock(wallet,coin_id,amount) {
            const block = { address: wallet.address, balance: [{ coin_id: coin_id, amount: total_supply }], representatives: [ { address: 100 } ], seq: 0, version: 1 };
            block['hash'] = "0000000000000000000000000000000000000000000000000000000000000000"; // only for first transaction block, since there is no previous block
            block['proof_of_work'] = await xcurrency.computeWork(block.hash);
            
            block['signature'] = xcurrency.sign(wallet.keys,block.hash);
        }

        const wallet = await xcurrency.generateWallet(); // .address='xrb_1..', .keys={seed:'..',private:'..',public:'..'} 
        console.log("wallet",wallet);
        const block = await generateBlock(wallet,coin_id,total_supply);
        console.log(block);
        // expect something like { address: 'xrb_1', balance: [ { coin_id: 993, amount: 133200000 } ], representatives: [ { xrb_1: 100 } ], block: 'ed12', pow: 1, seq: 0, version: 1 }
        process.exit(0); // close script

    } catch(err) { 
        console.log(err);
        process.exit(1);
    }
})();
