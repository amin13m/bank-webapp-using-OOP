import { Bank } from "../models/Bank.js";
import { Transaction } from "../models/Transaction.js";
import { Events } from "./events.js";
import { UI } from "./ui.js";
import { Auth } from "../models/Auth.js";



document.addEventListener("DOMContentLoaded",
  async ()=>{
    try {
 
      console.log("data loading")

      await Bank.loadAllFromServer()

      Auth.loadUser()
      if(!Auth.isLoggedIn()){
        UI.showSection("login")
      }else{
        UI.showSection("dashboard")
      }

      UI.init()
      Events.init()

      console.log("app ready")

    } catch (err) {
      console.log("err intializing app :" , err)
    }
})

