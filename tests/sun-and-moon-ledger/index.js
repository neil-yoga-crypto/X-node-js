(async function() { // async wrapper start +
try {
function hash(data) {
  const crypto = require("crypto");
  return crypto.createHash('sha512').update(JSON.stringify(data)).digest('hex');
}

function proofBlock(x,y,xyMap) {
  	if(x===0 && y===0) return {"valid":true, "verifier":null}; // genesis

  	let hexToVerify = xyMap[x + '.' + y];
  	if(!hexToVerify) throw Error("Block not found: ",x,y);

   	let coordinates = Object.keys(xyMap);
    let result =  {"valid":false, "verifiers":[]}; // in case block not references
  	for(let i=0;i<coordinates.length;i++) {
      		let key = coordinates[i];
    		let hexBlock = xyMap[key].block;
      		if( (x + '.' + y) in hexBlock.prev ) { // found reference, todo: neighbours only
      				console.log("found reference of " + (x+'.'+y) + " in",(hexBlock.x + '.' + hexBlock.y));
              		console.log('reference block',hexBlock);
      				let hashInHex = hexBlock.prev[(x + '.' + y)];
            		console.log("validating hash of ", hexToVerify.block);
            		let valid = hash(hexToVerify.block) === hashInHex;
              		result = {valid: valid, verifier: (hexBlock.x + '.' + hexBlock.y) }; // todo add multiple neighbours
              		break;
            }
      }

  	return result;

}


const crudfs = require('./lib/crud-fs');


let send =
    [
    JSON.parse( crudfs.read( './demo-data/x-send0.json' ) ),
    JSON.parse( crudfs.read( './demo-data/x-send1.json' ) ),
    JSON.parse( crudfs.read( './demo-data/x-send2.json' ) ),
    JSON.parse( crudfs.read( './demo-data/x-send3.json' ) ),
    JSON.parse( crudfs.read( './demo-data/x-send4.json' ) ),
    JSON.parse( crudfs.read( './demo-data/x-send5.json' ) )
   ]; // loading sun demo transactions

const xyMap = {};
send.forEach( ( item ) => {
    xyMap[item.block.x + "." + item.block.y] = item;
}); // also creating an xyMap to proof integrity via coordinates

// adding previous hash to 1 (0)
xyMap["1.0"].block.prev[( xyMap["0.0"].block.x + "." + xyMap["0.0"].block.y ) ] = hash( xyMap["0.0"].block );
;

// adding previous hashes to 2 (0 & 1)
xyMap["1.1"].block.prev[( xyMap["0.0"].block.x + "." + xyMap["0.0"].block.y ) ] = hash( xyMap["0.0"].block );
xyMap["1.1"].block.prev[( xyMap["1.0"].block.x + "." + xyMap["1.0"].block.y ) ] = hash( xyMap["1.0"].block );
;

// adding previous hashes to 3 (1)
xyMap["2.0"].block.prev[( xyMap["1.0"].block.x + "." + xyMap["1.0"].block.y ) ] = hash( xyMap["1.0"].block );
;

// adding previous hashes to 4 (1,2,3)
xyMap["2.1"].block.prev[( xyMap["1.0"].block.x + "." + xyMap["1.0"].block.y ) ] = hash( xyMap["1.0"].block );
xyMap["2.1"].block.prev[( xyMap["1.1"].block.x + "." + xyMap["1.1"].block.y ) ] = hash( xyMap["1.1"].block );
xyMap["2.1"].block.prev[( xyMap["2.0"].block.x + "." + xyMap["2.0"].block.y ) ] = hash( xyMap["2.0"].block );
;

// adding previous hashes to 5 (2,4)
xyMap["2.2"].block.prev[( xyMap["2.0"].block.x + "." + xyMap["2.0"].block.y ) ] = hash( xyMap["2.0"].block );
xyMap["2.2"].block.prev[( xyMap["2.1"].block.x + "." + xyMap["2.1"].block.y ) ] = hash( xyMap["2.1"].block );
;

console.log("block[0] valid (genesis): ", "expect true", proofBlock(0,0,xyMap));
console.log("block[1] ~ expect true >> ", proofBlock(1,0,xyMap));
console.log("block[2] ~ expect true >> ", proofBlock(1,1,xyMap));
console.log("block[3] ~ expect true >> ", proofBlock(2,0,xyMap));
console.log("block[4] ~ expect true >> ", proofBlock(2,1,xyMap));
console.log("block[5] (unreferenced) ~ expect false >>", proofBlock(2,2,xyMap));
process.exit(0); // close script
 } catch(err) { console.log(err);process.exit(1);}
})() // async wrapper end;
