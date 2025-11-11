const express = require("express");
const path = require("path");
const app = express();
const PORT = 9000;
const crypto = require("crypto");
const cors = require("cors");

app.use(cors());

class Block {
    constructor(index, timestamp, data, previourHash = "0") {
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

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Invalid hash at block ${i}: Data may have been tampered.`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Invalid previousHash at block ${i}: Chain broken.`);
                return false;
            }
        }
        console.log("Blockchain is valid!");
        return true;
    }

    printChain() {
        console.log("Blockchain:");
        this.chain.forEach((block, index) => {
            console.log(`Block ${index}:`);
            console.log(`  Index: ${block.index}`);
            console.log(`  Timestamp: ${block.timestamp}`);
            console.log(`  Data: ${JSON.stringify(block.data)}`);
            console.log(`  Previous Hash: ${block.previourHash}`);
            console.log(`  Hash: ${block.hash}`);
            console.log("---");
        });
    }
}

let localChain = new BlockChain();


app.get("/api/blance", (req, res) => {
    const accounts = ['0xAccount1', '0xAccount2', '0xAccount3', '0xAccount4'];
    const blances = accounts.map((acc, index) => {
        let blance = 1000000000; // initiak token = 1b cho acc = 1;
        localChain.chain.slice(1).forEach(block => {
            if (block.data.from === acc) {
                blance = blance - block.data.amount;
            }
            if (block.data.to === acc) {
                blance = blance + block.data.amount;
            }
        })
        return {amount: acc, blance: blance.toString()}
    })
    res.json(blances);
})

app.post("/api/transfer", express.json(), (req, res) => {
    const { sender, recipient, amount } = req.body;
    const newBlock = new Block(
        localChain.chain.length,
        new Date().toISOString(),
        { amount: parseInt(amount), from: sender, to: recipient }
    );
    localChain.addBlock(newBlock);
    console.log(`Local transfer: ${amount} from ${sender} to ${recipient}`);
    localChain.isChainValid() ? res.json({ success: true }) : res.status(400).json({ error: 'Invalid chain' });
})

app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
});