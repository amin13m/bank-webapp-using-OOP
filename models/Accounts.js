

export class BankAccount  {
    #id
    #userID
    #balence
    #bankId
    
    static #transactions=[]
    constructor(id  = BankAccount.generateId(),owner , userID , balence = 0 , bankId = null){
        if(new.target === BankAccount){
            throw new Error("you cant make obj using this class")
        }
        this.#id = id
        this.owner = owner;
        this.#userID = userID;
        this.#balence = balence;
        this.#bankId =bankId
    }


    get id(){return this.#id}
    get balence(){return this.#balence}
    get bankId(){return this.#bankId} 
    get userID(){return this.#userID}   
     
    toJSON(){
        return {id : this.#id , owner : this.owner , userID : this.#userID , balence : this.#balence , bankId : this.#bankId,
             _type : this.constructor.name
        }
    }

    static fromJSON(obj){
       if(obj._type === "SavingAccount"){
            return new SavingAccount(obj.id , obj.owner , obj.userID , obj.balence , obj.bankId )
        }else if(obj._type === "CheckingAccount"){
            return new CheckingAccount(obj.id , obj.owner , obj.userID , obj.balence , obj.bankId )
        } 
    }

    deposit(amount ){
        if(amount>0){
            this.#balence+=amount
        }
    }

    withdraw( amount ){
        if(amount >0 && amount <= this.balence){
            this.#balence -= amount
        }else{
            console.log("مبلغ واریزی صحیح نیست");
        }
    }

    update(data){
        Object.assign(this,data)
    }
    
    
    calculateInterest(){
        throw new Error("this method must be overriden")
    }


   static generateId(){ 
    
      const D = new Date();
      const ID = `${D.getFullYear()}${D.getMonth()}${D.getDate()}${D.getHours()}${D.getMinutes()}${D.getSeconds()}${D.getMilliseconds()}`

      return `AC_${ID}`
    }


    get accTansactions(){
        return BankAccount.#transactions
    }

    get allTransactions(){
        BankAccount.#transactions = BankAPI.deserialize(BankAPI.getTransactions())
        return BankAccount.#transactions
    }


}



export class SavingAccount extends BankAccount{
    constructor(id , owner , userID , balence , bankId ){
        super(id , owner , userID , balence , bankId )
    }
    calculateInterest(){
        return this.balence * 0.05
    }
}


export class CheckingAccount extends BankAccount{
    constructor(id , owner , userID , balence , bankId ){
        super(id , owner , userID , balence , bankId )
    }
    calculateInterest(){
        return this.balence * 0.01
    }
}

