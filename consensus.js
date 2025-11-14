// TO DO:
// Tạo được các node , 1 node có thể có nhiểu nhiệm vụ khác nhau

// Nếu chọn PoA vào dự án tức xác minh thoe danh tính
// Quyền xác thực các chứng chỉ đó real --> Validator --> (ĐH, Cơ quan xác nhận) --> Mỗi thằng validator có 1 ledger riêng
// Transaction --> ok --> valitor <-- ok 
// Ledger upd đồng bộ --> Ko thể chỉnh sửa các dữ liệu đơn phương

// Cần 1 network

class Validator {
    constructor(name, isActive = true) {
        this.name = name;
        this.isActive = isActive;
        this.ledger = [];
    }

    addTransaction(data) {
        // tránh tham chiếu, clone dữ liệu
        this.ledger.push(JSON.parse(JSON.stringify(data)));
    }

    vote(data){
        if(!this.isActive) return false;

        // 70% đồng ý (giả lập)
        const decision = Math.random() < 0.7;
        return decision;
    }
}

class Network {
    constructor(validators) {
        this.validators = validators;
        this.transactionPool = [];
    }

    chooseProposer() {
        const activeValidators = this.validators.filter(v => v.isActive);
        const index = Math.floor(Math.random() * activeValidators.length);
        return activeValidators[index];
    }

    validateTransaction(data) {
        let approvals = 0;

        this.validators.forEach(v => {
            if (v.vote(data)) approvals++;
        });

        const consensus = approvals >= Math.ceil(this.validators.length / 2);
        return consensus;
    }

    broadcastTransaction(data){
        const proposer = this.chooseProposer();
        console.log("Proposer:", proposer.name);

        if (this.validateTransaction(data)) {
            data.status = "Success";
            data.approvedBy = proposer.name;
        } else {
            data.status = "Reject";
            data.approvedBy = null;
        }

        // đồng bộ ledger cho toàn bộ validator
        this.validators.forEach(v => v.addTransaction(data));
    }

    showLedger() {
        this.validators.forEach(v => {
            console.log(`Ledger of Validator ${v.name}:`);
            console.log(v.ledger);
            console.log("---------------------------------");
        });
    }
}

class Transaction {
    constructor(studentId, degree, university){
        this.studentId = studentId;
        this.degree = degree;
        this.university = university;
        this.timestamp = new Date();
        this.status = "Pending";
        this.approvedBy = null;
    }
}

const validators = [
    new Validator("1"),
    new Validator("2"),
    new Validator("3"),
    new Validator("4"),
    new Validator("5", false),
]


const network = new Network(validators)

const data1 = new Transaction("s1", "HUst", "1");
const data2 = new Transaction("s2", "PTit", "2");
const data3 = new Transaction("s6", "HUst", "4");


network.broadcastTransaction(data1);
network.broadcastTransaction(data2);
network.broadcastTransaction(data3);

network.showLedger();