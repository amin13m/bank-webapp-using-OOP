import { BankAPI } from "../scripts/api.js";
import { Bank } from "./Bank.js";

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



  static async execute(fromAccount, toAccount, amount) {
      if (fromAccount.balence < amount) {
      throw new Error("Insufficient funds");
    }

    // 1. OOP changes
    fromAccount.withdraw(amount);
    toAccount.deposit(amount);

    // 2. server balece update
    await BankAPI.updateAccount(fromAccount);
    await BankAPI.updateAccount(toAccount);
   
   //3.  making transaction

    const transaction = new Transaction(
      undefined,
      fromAccount,
      toAccount,
      amount
    );

    //4. sening transactions to server

    const savedTransaction = await BankAPI.addTransaction(transaction);

    console.log(" Transaction executed successfully:",transaction.info());
    return savedTransaction;
  

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

  static fromJSON(data){
     
    return new Transaction(
      data.id,
      Bank.findAccountById(data.fromID),
      Bank.findAccountById(data.toID),
      data.amount,
      new Date(data.date)
    )
  }

  static async loadAllFromServer() {
    let allTA = await BankAPI.getAllTransactions();

    return allTA.map(t => Transaction.fromJSON(t))
  }

  static async loadAccountsTransactionsById(accID) {
    let TA =  await BankAPI.getTransactionsByAccountId(accID);
  
    return TA.map(t => Transaction.fromJSON(t))
  }

  static generateId() {
      const D = new Date();
      const ID = `${D.getFullYear()}${D.getMonth()}${D.getDate()}${D.getHours()}${D.getMinutes()}${D.getSeconds()}${D.getMilliseconds()}`

      return `TA_${ID}`
  }

  static typeOfTxForAccount(tx , accID) {
    return  tx.fromAccount.id ===accID ? "wisdraw" : "diposit";
  }

  static typeOfTxForAccountFARSI(tx , accID) {
    return  tx.fromAccount.id ===accID ? "برداشت" : "واریز";
  }

  info() {
    return `  amount : ${this.amount} from : ${this.fromAccount.id}  to : ${this.toAccount.id}  in date : ${this.date}`;
  }

};
