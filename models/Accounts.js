import BankUtils from "./BankUtils.js"

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



export class savingAccount extends BankAccount{
    constructor(name , password , balence){
        super(name , password , balence)
    }
    calculateInterest(){
        return this.balence * 0.05
    }
}


export class checkingAccount extends BankAccount{
    constructor(name , password , balence){
        super(name , password , balence)
    }
    calculateInterest(){
        return this.balence * 0.01
    }
}

