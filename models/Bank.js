import { BankAPI } from "../scripts/api.js";
import { SavingAccount, CheckingAccount, BankAccount  } from "./Accounts.js";
import { Transaction } from "./Transaction.js";

export class Bank {
  static #allBanks = [];
  static #allAccounts = [];
  ;
  constructor(id = Bank.generateId(), name) {
    this.id = id;
    this.name = name;
    this.accounts = [];
    Bank.#allBanks.push(this);
  }


  static get allBanks(){return Bank.#allBanks}
  static set allBanks(banks){Bank.#allBanks = banks}

  static get allAccounts() {
    return Bank.#allAccounts;
  }
  static set allAccounts(accounts) {
    Bank.#allAccounts = accounts;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      _type: this.constructor.name,
    };
  }

  static fromJSON(data){
    return new Bank(data.id, data.name)
  }

  static async loadAllFromServer(){
    const [banksRaw, accountsRaw] = await Promise.all([
      BankAPI.getBanks(),
      BankAPI.getAccounts()
    ]);

    
    Bank.#allBanks = banksRaw.map(b => Bank.fromJSON(b));
    const bankById = new Map(Bank.#allBanks.map(b => [b.id, b]));



    Bank.#allAccounts = accountsRaw.map(aRaw => {
      const acc = BankAccount.fromJSON(aRaw);
      const bank = bankById.get(acc.bankId);
      

      if (bank) {
        bank.accounts.push(acc);
      }
      return acc;
    });

    return { banks: Bank.#allBanks, accounts: Bank.allAccounts };
  }


  async loadThisBankAccounts() {
    const accountsRaw = await BankAPI.getAccountsByBank(this.id);
    this.accounts= accountsRaw.map(a => Account.fromJSON(a));
  }


  static findBankById(id) {
    if (Bank.#allBanks.find((bank) => bank.id === id)) {
      return Bank.#allBanks.find((bank) => bank.id === id);
    } else {
      return null;
    }
  }

  static async findBankByName(name) {
  
    if (Bank.#allBanks.find((bank) => bank.name === name)) {
      return Bank.#allBanks.find((bank) => bank.name === name);
    } else {
      return null;
    }
  }
  
  

  findAccountById(id) {
    if (this.accounts.find((account) => account.id === id)) {
      return this.accounts.find((account) => account.id === id);
    } else {
      return null;
    }
  }

  findUsersAccounts(owner) {
    return this.accounts.filter((account) => account.owner === owner);
  }

  static findAccountById(id) {
    if (Bank.#allAccounts.find((account) => account.id === id)) {
      return Bank.#allAccounts.find((account) => account.id === id);
    } else {
      return null;
    }
  }

  static findAccountByName(name) {
    if (Bank.#allAccounts.filter((account) => account.name === name)) {
      return Bank.#allAccounts.filter((account) => account.name === name);
    } else {
      return null;
    }
  }

  removeAccount(id) {
    this.accounts = this.accounts.filter((account) => account.id !== id);
    Bank.#allAccounts = Bank.#allAccounts.filter(
      (account) => account.id !== id
    );
  }

  printReport() {
    console.log(`${this.name} report : `);
    this.accounts.forEach((e) =>
      console.log(`id : ${e.id} ${e.name} : ${e.balence}`)
    );
  }

  getAllAccounts() {
    return [...this.accounts];
  }

  static getAllAccountsInSystem() {
    return [...Bank.#allAccounts];
  }

  static getAllBanks() {
    return [...Bank.#allBanks];
  }

  static generateId() {
    
      const D = new Date();
      const ID = `${D.getFullYear()}${D.getMonth()}${D.getDate()}${D.getHours()}${D.getMinutes()}${D.getSeconds()}${D.getMilliseconds()}`

      return `BA_${ID}`
  }


 

  async addAccount(
    owner,
    userID,
    balance = 0,
    accountType = "CheckingAccount"
  ) {
    const acc =
      accountType === "SavingAccount"
        ? new SavingAccount(undefined, owner, userID, balance, this.id)
        : new CheckingAccount(undefined, owner, userID, balance, this.id);
    this.accounts.push(acc);
    Bank.#allAccounts.push(acc);
    await BankAPI.addAccount(acc);

    return acc;
  }


  static async deleteAccount(id) {
    try {

      Bank.#allAccounts = Bank.#allAccounts
        .filter((account) => account.id !== id);

      await BankAPI.deleteAccountById(id);

    } catch (err) {
      console.log(err)
    }
  }



  static transfer(fromId, toId, amount) {
  
    let fromAcc=Bank.findAccountById(fromId);
    let toAcc=Bank.findAccountById(toId);
    return Transaction.execute(fromAcc, toAcc, amount);
  }

  static findUsersAccounts(user) {
    return Bank.#allAccounts.filter((account) => account.owner === user.username);
  }

  findThisBankUsersAccount(user){
    return this.accounts.filter((account) => account.owner === user.username);
  }

  static sortUserAccountByBank(bankId) {
    return Bank.#allAccounts.filter((account) => account.bankId === bankId);
  }
}
