import { Bank } from "./Bank.js"
export default class BankUtils{

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