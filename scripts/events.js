
import { UI } from "./ui.js"
import { Bank} from "../models/Bank.js"
import { BankAPI } from "../scripts/api.js"
import { Auth } from "../models/Auth.js";
import { Charts } from "./chart.js";

export const Events = {
  init() {
    this.bindUIEvents();
    console.log("🎯 Event handlers فعال شدند");
  },

  bindUIEvents() {
//    document
//      .querySelector("#bankList")
//      .addEventListener("change", this.handleBankSelect);
    document
      .querySelector("#transferForm")
      .addEventListener("submit", this.handleTransfer);
    document
      .querySelector("#accountList")
      .addEventListener("click", this.handleAccountSelect);
    document
      .querySelector("nav")
      .addEventListener("click", this.navHandler);
    document
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", this.navHandler));
    document
      .querySelector("#loginForm")
      .addEventListener("submit",this.loginHandler);
    document
      .querySelector("#createAccountForm")
      .addEventListener("submit",this.createAccountHandler);
    document
      .querySelector("#logoutBtn")
      .addEventListener("click",this.logoutHandler);
    window
      .addEventListener("scroll", this.handleScroll);
    document
      .querySelector("#acc-sc-accountList")
      .addEventListener("click", this.handleAccountSelectInAccountSection);
    document
      .querySelector("#createBankAccountBtn")
      .addEventListener("click", this.handleCreateBankAccountBtn);
    document
      .querySelector("#createBankAccountForm")
      .addEventListener("submit", this.handleCreateBankAccountForm);
    document
      .querySelector("#deleteBankAccountBtn")
      .addEventListener("click", this.handleDeleteBankAccountBtn);
    document
      .querySelector("#agreeDeleteBankAccountBtn")
      .addEventListener("click", this.handleAgreeDeleteBankAccountBtn);
    document
      .querySelector("#cancelDeleteBankAccountBtn")
      .addEventListener("click" , this.handleCancelDeleteBankAccountBtn);
    },

  async handleBankSelect(e) {
    const bankId = e.target.value;
    const accounts = await Bank.getAccountsByBank(bankId);
    UI.renderAccounts(accounts);
  },

  handleAccountSelect(e) {
    const accountId = e.target.value;
    const account = Bank.findAccountById(accountId);
    UI.renderDasbourdTransactions(account);
    UI.renderTransactions(account);
  
    if(Charts.curentChart!==undefined)Charts.curentChart.destroy()
    Charts.renderWeeklyChart(accountId)
      //UI.renderAccount(account);
  },

  async handleTransfer(e) {
    e.preventDefault();
   
    const fromId = e.target.fromAccount.value;
    const toId = e.target.toAccount.value;
    const amount = Number(e.target.amount.value);

    if(fromId == toId){
      UI.showError("انتقال به حساب منتقل کننده وجود ندارد");
      throw new Error("انتقال به حساب منتقل کننده وجود ندارد");
    }

    try {
      await Bank.transfer(fromId, toId, amount);
      const accounts = Bank.getAllAccountsInSystem();
      UI.renderUpdate();
//
      UI.showMsg("انتقال با موفقیت انجام شد");
      
      UI.showDashboard()
    } catch (err) {
      console.log(err);
      UI.showError("خطا در انجام تراکنش");
    }
  },

  navHandler(e) {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") return;
    if (!Auth.isLoggedIn() ){
      if(!(e.target.dataset.section ==  "createAccount" || e.target.dataset.section ==  "login")){
        UI.showSection("login")
        UI.showError("لطفا اول وارد حساب خود شوید");
      }else{
        
        const sectionId = e.target.dataset.section;
        UI.showSection(sectionId);
    
      }
    }  
  },

  async loginHandler(e){
    e.preventDefault();
    const username = e.target.username.value
    const password = e.target.password.value
    try {
      let user = await Auth.login(username , password)
  //    UI.showDashboard(user)
      UI.showSection("dashboard");
      UI.showLoginBtn();
      UI.renderElements();
    } catch (err) {
      console.log(err)
      UI.showError("login failed : " + err.message)
    }
  },

  async createAccountHandler(e){
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      let allreadyExist = await Auth.isUsernameExist(username);
      if(allreadyExist){
        UI.showError("نام کاربری قبلا ثبت شده است");
      }else{
        let user =await Auth.register(username, password);
        
        UI.showSection("dashboard");
        UI.showDashboard(user)
        UI.showLoginBtn();
        UI.renderElements();
      }
    } catch (err) {
      console.log(err)
      UI.showError("regester failed : " + err.message);
    }
  },

  async handleDeleteBankAccountBtn(e){
    if(Auth.currentAccount === null){
      UI.showError("حسابی برای حذف انتخاب نشده است");
    }else{
      e.preventDefault();
      UI.rendershowDLTAccountDescription();
      UI.showSection("agreeDeleteBankAccount")
    }
  },


  async handleAgreeDeleteBankAccountBtn(e){
    e.preventDefault();
    const accountId = Auth.currentAccount.id
    const agree = document.querySelector("#agreeDeleteAccountInput").checked
    if(!agree){
      UI.showError("لطفا اول با حذف حساب موافت کنید");

      return
    }
    try {
      await Bank.deleteAccount(accountId);
      await Bank.loadAllFromServer()
      UI.showMsg("حساب با موفقیت حذف شد");
      UI.renderElements();
      UI.showSection("accounts");

      Auth.currentAccount = null
    } catch (err) {
      console.log(err)
      UI.showError("حذف حساب با خطا مواجه شد");
    }

  },

  

  handleCancelDeleteBankAccountBtn(e){
    e.preventDefault()
    UI.showSection("accounts")
  },


   
  

  logoutHandler(){
    Auth.logout()
    UI.showLoginBtn()
    UI.showSection("login")
  },


  handleAccountSelectInAccountSection(e){
    const accountId = e.target.value;
    const account = Bank.findAccountById(accountId);
    Auth.currentAccount = account
    UI.renderAccount();
  },


  handleCreateBankAccountBtn(e){
    e.preventDefault();
    UI.showSection("createBankAccount")
  },

  async handleCreateBankAccountForm(e){
    e.preventDefault()
    const accounts = Bank.findUsersAccounts(Auth.currentUser);

    const userID = accounts[0].id;
    const owner = accounts[0].owner;
    const balance = Number(e.target.initialBalance.value);
    const bank =await Auth.currentBank()
    const accountType = e.target.accountType.value;
    

    try {
      await bank.addAccount(owner, userID, balance, accountType)
      
      UI.showMsg("حساب با موفقیت ایجاد شد");
      UI.renderElements();
      UI.showSection("accounts");
    } catch (err) {
      console.log(err)
      UI.showError("regester failed : " + err.message);
    }


  },

  handleScroll(){
    const scrollTop = window.scrollY; 
    const docHeight = document.body.scrollHeight - window.innerHeight; 
    const scrollPercent = (scrollTop / docHeight) * 100;

    document.getElementById("scroll-progress").style.width = scrollPercent + "%";
  }

};
