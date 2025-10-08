import { BankAPI } from "../scripts/api.js";
import { SavingAccount, CheckingAccount, BankAccount } from "./accounts.js";

export class Bank {
  static #allBanks = [];
  static #allAccounts = [];
  #accounts = [];
  constructor(id = Bank.generateId(), name) {
    this.id = id;
    this.name = name;
    Bank.#allBanks.push(this);
  }

  static ID = 1;

  static get allAccounts() {
    return Bank.#allAccounts;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      accounts: this.#accounts,
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
      const bank = bankById.get(aRaw.bankId);
      if (bank) {
        bank.#accounts.push(acc);
      }
      return acc;
    });


    return { banks: Bank.#allBanks, accounts: Bank.allAccounts };
  }


  async loadThisBankAccounts() {
    const accountsRaw = await BankAPI.getAccountsByBank(this.id);
    this.#accounts= accountsRaw.map(a => Account.fromJSON(a));
  }


  static findBankById(id) {
    if (Bank.#allBanks.find((bank) => bank.id === id)) {
      return Bank.#allBanks.find((bank) => bank.id === id);
    } else {
      return null;
    }
  }

  static findBankByName(name) {
    console.log(this.#allBanks)
    if (Bank.#allBanks.filter((bank) => bank.name === name)) {
      return Bank.#allBanks.filter((bank) => bank.name === name);
    } else {
      return null;
    }
  }


  async addAccount(account) {
    this.#accounts.push(account);
    Bank.#allAccounts.push(account);
    account.bankId = this.id;
    let isExist = await BankAPI.getAccountById(account.id);

    if (!isExist[0]) {
      await BankAPI.addAccount(account);
      console.log("false ,account , isExist");
    } else {
      console.log("accont already add to the bank");
    }
  }


  findAccountById(id) {
    if (this.#accounts.find((account) => account.id === id)) {
      return this.#accounts.find((account) => account.id === id);
    } else {
      return null;
    }
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
    this.#accounts = this.#accounts.filter((account) => account.id !== id);
    Bank.#allAccounts = Bank.#allAccounts.filter(
      (account) => account.id !== id
    );
  }

  printReport() {
    console.log(`${this.name} report : `);
    this.#accounts.forEach((e) =>
      console.log(`id : ${e.id} ${e.name} : ${e.balence}`)
    );
  }

  getAllAccounts() {
    return [...this.#accounts];
  }

  static getAllAccountsInSystem() {
    return [...Bank.#allAccounts];
  }

  static getAllBanks() {
    return [...Bank.#allBanks];
  }

  static generateId() {
    let id = `BA_${new Date()}`;
    return id.replace(/\s+/g, "");
  }


 

  async addAccount(
    owner,
    password,
    balance = 0,
    accountType = "CheckingAccount"
  ) {
    const acc =
      accountType === "SavingAccount"
        ? new SavingAccount(undefined, owner, password, balance, this.id)
        : new CheckingAccount(undefined, owner, password, balance, this.id);
    this.#accounts.push(acc);
    Bank.#allAccounts.push(acc);
    await BankAPI.addAccount(acc);
    console.log(acc);
    return acc;
  }

 

  get accounts() {
    return this.#accounts;
  }
  set accounts(accounts) {
    this.#accounts = accounts;
  }
}


/*
 async updateAccount(accountId, newData) {
    const acc = this.#accounts.find((a) => a.id === accountId);
    if (!acc) throw new Error("Account not found");
    acc.update(newData);
    await BankAPI.updateAccount(acc.id, acc.toJSON());
  }
 static async loadAllAccounts() {
    const data = await BankAPI.getAccountsByBank(this.id);
    
    
    let accs = data.map((acc) => {
      if (acc._type === "SavingAccount")
        return new SavingAccount(
          acc.id,
          acc.owner,
          acc.password,
          acc.balence,
          acc.bankId
        );
      if (acc._type === "CheckingAccount")
        return new CheckingAccount(
          acc.id,
          acc.owner,
          acc.password,
          acc.balence,
          acc.bankId
        );

        Object
    });
  }
  async loadAccounts() {
    const data = await BankAPI.getAccountsByBank(this.id);
    let accs = data.map((acc) => {
      if (acc._type === "SavingAccount")
        return new SavingAccount(
          acc.id,
          acc.owner,
          acc.password,
          acc.balence,
          acc.bankId
        );
      if (acc._type === "CheckingAccount")
        return new CheckingAccount(
          acc.id,
          acc.owner,
          acc.password,
          acc.balence,
          acc.bankId
        );
    });
    this.accounts.push(...accs);
    Bank.#allAccounts.push(...accs);
  }
*/