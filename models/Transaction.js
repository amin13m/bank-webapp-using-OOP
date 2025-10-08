import { BankAPI } from "../scripts/api.js";

export let Transaction = class {
  constructor(
    id = Transaction.generateId(),
    fromACC,
    toACC,
    amount,
    date = new Date()
  ) {
    this.id = id;
    this.fromAccount = fromACC;
    this.toAccount = toACC;
    this.amount = amount;
    this.date = date;
  }

  static ID = 1;

  //let TA = new Transaction(undefined  , acc2 ,acc1,190)
  async execute() {
    if (this.fromAccount.balence < this.amount) {
      throw new Error("Insufficient funds");
    }

    // 1. OOP changes
    this.fromAccount.withdraw(this.amount);
    this.toAccount.deposit(this.amount);

    // 2. server balece update
    await BankAPI.updateAccount(this.fromAccount);
    await BankAPI.updateAccount(this.toAccount);

    // 3. add trasaction to server
    const savedTA = await BankAPI.addTransaction(this);
    
    console.log("Transaction completed:", savedTA);

    return savedTA;
  }

  toJSON() {
    return {
      id: this.id,
      fromID: this.fromAccount.id,
      toID: this.toAccount.id,
      amount: this.amount,
      date: this.date,
      _type: this.constructor.name,
    };
  }

  static async loadAllFromServer() {
    return await BankAPI.getAllTransactions();
  }

  static async loadAccountsTransactionsById(accID) {
    return await BankAPI.getTransactionsByAccountId(accID);
  }

  static generateId() {
    let id = `TA_${new Date()}`;
    return id.replace(/\s+/g, "");
  }

  info() {
    return `type : ${this.type} , from : ${this.from} , to : ${this.to} , amount : ${this.amount} , date : ${this.date}`;
  }
};
