
class BankAccount  {
    #id
    #password
    #balence
    #transactions =[]
    constructor(name , password , balence = 0){
        if(new.target === BankAccount){
            throw new Error("you cant make obj using this class")
        }
        this.name = name;
        this.#password = password;
        this.#balence = balence;
        this.#id = BankUtils.generateId()
    }

    diposit(from , amount ){
        let to = this.#id
        if(amount>0 ){
            this.#balence += amount;
            from.balence -= amount
            this.#addTransaction("diposit",from , to , amount)
        }else{
            console.log("مبلغ واریزی صحیح نیست");
        }
    }

    withdrow( to , amount ){
        let from = this.#id 
        if(amount >0 && amount <= this.#balence){
            this.#balence -= amount
            to.balence += amount
            this.#addTransaction("withdrow",from , to , amount)
        }else{
            console.log("مبلغ واریزی صحیح نیست");
        }
    }

    get balence(){
        return this.#balence
    }

    set balence(amount){
        if(amount >0){
                this.#balence = amount    
        }
    }

    get id(){
        return this.#id
    }
    
    calculateInterest(){
        throw new Error("this method must be overriden")
    }

    checkPassword(password){
        return this.#password === password
    }


    static Transaction = class{
        constructor(type ,from , to , amount , date = new Date()){
            this.type = type
            this.from = from
            this.to = to
            this.amount = amount
            this.date = date
        }

        info(){
            console.log(`مبلغ ${this.amount} ریال از ${this.from.name} به ${this.to.name} واریز شد`)
        }
    }

    
    #addTransaction(type ,from , to , amount ){
        let transaction = new BankAccount.Transaction(type ,from , to , amount)
        this.#transactions.push(transaction)
    }

    get tansactions(){
        return this.#transactions
    }

}



class savingAccount extends BankAccount{
    constructor(name , password , balence){
        super(name , password , balence)
    }
    calculateInterest(){
        return this.balence * 0.05
    }
}


class checkingAccount extends BankAccount{
    constructor(name , password , balence){
        super(name , password , balence)
    }
    calculateInterest(){
        return this.balence * 0.01
    }
}



class Bank {
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


class BankUtils{

    static generateId(){ 
        let id = Math.floor(Math.random()*100000)
        if(Bank.getAllAccountsInSystem().includes(id)){
            id = BankAccount.generateId()
        }else{
            return id
        }
    }

    static converCurrency(amount){
        return amount.toLocaleString('fa-IR')
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


