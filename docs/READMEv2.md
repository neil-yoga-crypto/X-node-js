# X-node-nodejs
X: Simply The Best Possible Digital Currency with Zero Fees. Supports Multiple Coins. Real Decentralization. Real Security. Real Transparency. Run Your Own Coin Network or Join Ours.

(Currently in initial testing/play phase, testnet launching as soon as possible) 

## Server Setup
### Preparing Your Server
Install basic dependencies and clone the repository
```
# (Currently in initial testing/play phase, testnet launching as soon as possible) 
sudo apt update; sudo apt upgrade -y; sudo apt install curl git -y;
git clone https://github.com/neil-yoga/X-node-js
cd X-node-js
ufw allow 22 # firewall: allow ssh
ufw allow 80 # firewall: allow http
ufw allow 443 # firewall: allow https
ufw enable # firewall: block everything else
```

### Preparing NodeJS environment
```
# follow download instructions on https://github.com/nvm-sh/nvm
nvm use --latest
npm install
```

## Using X-Node
### Creating the first wallet
1. You: 📚 Initiate first wallet with all new coins in existence and append it to your authorized_coins.json file on your server >> { address: 'xrb_1', balance: [ { coin_id: 993, amount: 133200000 } ], representatives: [ { xrb_1: 100 } ], block: 'ed12', pow: 1, seq: 0, version: 1 }


2. X Network: 📈 Syncs >> {'action':'get_reps_and_sync'} Succeeded. Ledgers have latest account blocks. xrb_1 now has 133200000 of coin_id 993 (X).

3. X Wallet Software: 📚 Retrieves first wallet from Public API >> { address: 'xrb_1', balance: [ { coin_id: 993, amount: 133200000 } ], representatives: [ { xrb_1: 100 } ], block: 'ed12', pow: 1, seq: 0, version: 1 }

### Interacting with a second wallet
4. You: 📚 Create your second address in X Wallet Software >> { address: 'xrb_2' }

5. You: 📚 Create your first transaction on xrb1's ledger and send it to Public API >> { address: 'xrb_1', balance: [ { coin_id: 993, amount: 133000000 } ], send: { coin_id: 993, amount: 200000, to: 'xrb_2' }, representatives: [ { xrb_9: 100 } ], block: '123', pow: 1, seq: 2, signature: 'mocksignature123' }

6. X Network: 📈 Initiates election >> {'action':'get_reps_and_start_vote_party'} Succeeded. Change commited to all the ledgers of each rep.

7. X Wallet Software: 📚 Receives Notification via Public API and Creates your first receive confirmation on xrb2's ledger and send it to Public API >> { address: 'xrb_2', balance: [ { coin_id: 993, amount: 200000 } ], received: { coin_id: 993, amount: 200000, from: 'xrb_1' }, representatives: [ { xrb_9: 80, xrb_12: 20 } ], block: '456', pow: 1, seq: 2, signature: 'mocksignature123' }

8. X Network: 📈 Initiates election >> {'action':'get_reps_and_start_vote_party'} Succeeded. Change commited to all the ledgers of each rep.

9. X Network: 📈 Syncs >> {'action':'get_reps_and_sync'} Succeeded. Ledgers have latest account blocks.

Result:
📚 Wallet 1 (133000000 X) >> { address: 'xrb_1', balance: [ { coin_id: 993, amount: 133000000 } ], send: { coin_id: 993, amount: 200000, to: 'xrb_2' }, representatives: [ { xrb_9: 100 } ], block: '123', pow: 1, seq: 2, signature: 'mocksignature123' }

📚 Wallet 2 (200000 X) >> { address: 'xrb_2', balance: [ { coin_id: 993, amount: 200000 } ], received: { coin_id: 993, amount: 200000, from: 'xrb_1' }, representatives: [ { xrb_9: 80, xrb_12: 20 } ], block: '456', pow: 1, seq: 2, signature: 'mocksignature123' }

### Now in code:

### Step 1:
```
Use the webclient in 6 easy steps:
cd basic-wallet/webclient
npm install
npm run
# open browser at localhost:3000
# fill in genesis form
# copy block into authorized_coins.json
```
