const crypto = require("crypto");

class Block {
    constructor(index, timestamp, data, previourHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previourHash = previourHash;
        this.hash = this.calculateHash();
    }
    
    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(this.index + this.previourHash + this.timestamp + JSON.stringify(this.data))
            .digest("hex");
    }
}


class BlockChain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
    }

    createGenisisBlock() {
        return new Block(0, "05/11/2025", "Is the first", "0");
    }

    getGenisisBlock () {
        return this.chain[this.chain.length - 1];
    }

    addBlock (newBlock) {
        newBlock.previourHash = this.getGenisisBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid () {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBl = this.chain[i];
            const previousBl = this.chain[i - 1];
            // ??? cai hash nay da dc luu chua va co khop ko  --> fasle

            if (currentBl.hash !== currentBl.calculateHash()) {
                return false;
            }
            // co tro den ko  --> false
            if (currentBl.previourHash !== previousBl.hash) {
                return false
            }
        }
        return true;
    }
}


let saveData = new BlockChain();
saveData.addBlock(new Block(1, "05/11/2025", {amount: 4}));
saveData.addBlock(new Block(2, "05/11/2025", {amount: 10}));

console.log(JSON.stringify(saveData, null, 4));