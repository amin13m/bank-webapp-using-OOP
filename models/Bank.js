



import { savingAccount, checkingAccount } from "./Accounts.js";



export class Bank {
    static #allBanks = []
    static #allAccounts = []
    #acounts = []
    constructor(name){
        this.name = name
        Bank.#allBanks.push(this)
    }

    addAccount(account){
        this.#acounts.push(account)
        Bank.#allAccounts.push(account)
    }

    findAccountById(id){
        if(this.#acounts.find(account => account.id === id)){
            return this.#acounts.find(account => account.id === id)
        }else{
            return null
        }
    }

    static findAccountById(id){
        if(Bank.#allAccounts.find(account => account.id === id)){
            return  Bank.#allAccounts.find(account => account.id === id)
            
        }else{
            return null
        }
    }

    static findAccountByName(name){
        if(Bank.#allAccounts.filter(account => account.name === name)){
            return  Bank.#allAccounts.filter(account => account.name === name)
            
        }else{
            return null
        }
    }

    removeAccount(id){
        this.#acounts = this.#acounts.filter(account => account.id !== id)
        Bank.#allAccounts = Bank.#allAccounts.filter(account => account.id !== id)
    }

    printReport(){
        console.log(`${this.name} report : `)
        this.#acounts.forEach(e=> console.log(`id : ${e.id} ${e.name} : ${e.balence}`))
    }

    getAllAccounts(){
        return [ ...this.#acounts]
    }

    static getAllAccountsInSystem(){
        return [ ...Bank.#allAccounts]
    }

    static getAllBanks(){
        return [...Bank.#allBanks]
    }
    
}





let sepehr = new Bank("sepehr bank")
let ayande = new Bank("ayande bank")

let aliSA = new savingAccount("ali" , "1234" , 10000)
let ahmadCA = new checkingAccount("ahmad" , "1234" , 10000)
let mohammadCA = new checkingAccount("mohammad" , "1234" , 10000)
let mohammadSA = new savingAccount("mohammad" , "1234" , 10000)

sepehr.addAccount(aliSA)
sepehr.addAccount(ahmadCA)
ayande.addAccount(mohammadCA)
ayande.addAccount(mohammadSA)

sepehr.printReport()


