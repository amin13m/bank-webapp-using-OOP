import { Bank } from "../models/Bank.js";
import { Transaction } from "../models/Transaction.js";
import { Events } from "./events.js";
import { UI } from "./ui.js";
import { Auth } from "../models/Auth.js";



document.addEventListener("DOMContentLoaded",
  async ()=>{
    try {
      Auth.loadUser()

      if(!Auth.isLoggedIn()){
        UI.showSection("login")
      }else{
        UI.showSection("dashboard")
      }

      console.log("data loading")

      await Bank.loadAllFromServer()

      UI.init()
      Events.init()

      console.log("app ready")
      
    } catch (err) {
      console.log("err intializing app :" , err)
    }
})






























//owner,password, balance 
/*


let  test = async()=>{

  let sepehr = Bank.findBankByName("sepehr")
  let ayande = Bank.findBankByName("ayande")
  let mellat = Bank.findBankByName("mellat")

  let acc1 = Bank.findAccountById("ac1")
  let acc2 =  Bank.findAccountById("ac2")
  let acc3 = Bank.findAccountById("ac3")

  await Transaction.execute(acc1,acc2,100)


  let t =await Transaction.loadAllFromServer()
  let at = await Transaction.loadAccountsTransactionsById(acc3.id)

}






  let banks = await BankAPI.getBanks();

  let mellat = new Bank(banks[0].id, banks[0].name);
  await mellat.loadAccounts();

  console.log("Accounts:", mellat.accounts);
  
  
    sepehr.addAccount("ali", "1234"  , 10000)
    console.log(await BankAPI.getAccountById("AC_MonOct06202506:01:05GMT-0700(PacificDaylightTime)"))

    et ayande = new Bank(undefined,"ayande bank")

let aliSA =  new SavingAccount(undefined , "ali" , 1234 , 10000  )
let ahmadCA = new CheckingAccount(undefined,"ahmad" , "1234" , 10000)
let mohammadCA = new CheckingAccount(undefined,"mohammad" , "1234" , 10000)
let mohammadSA = new SavingAccount(undefined,"mohammad" , "1234" , 10000)

mohammadCA.withdrow(ahmadCA,100)


sepehr.addAccount(aliSA)
sepehr.addAccount(ahmadCA)
ayande.addAccount(mohammadCA)
ayande.addAccount(mohammadSA)

// مثال: ایجاد حساب جدید
//  await mellat.addAccount("Hossein", 120000);

  // مثال: بروزرسانی حساب
//  await mellat.updateAccount(101, { balance: 600000 });

  let Ac =await BankAPI.getAccounts()
  Ac.map(ac=>{
    
  console.log("sdg",BankAPI.deserialize(ac))
  })
  
*/