import { Bank } from "../models/Bank.js";
import { Auth } from "../models/Auth.js";
import { Transaction } from "../models/Transaction.js";

export const UI = {
  init() {
    this.cacheElements();
    this.setupNavigation();
    this.setupMenuToggle();
    this.showLoginBtn();

    this.renderElements()
    
    console.log("🖥️ UI آماده شد");
    
  },

  renderElements(){
    if(Auth.isLoggedIn()){
      this.renderAccounts() 
      this.renderWelcome();  
      this.renderForm();
      if(Auth.currentAccount!==null) this.renderDasbourdTransactions()
    }
  },

  setupNavigation() {
    document.querySelectorAll("header nav button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.showSection(e.target.dataset.section);
      });
    });
  },

  showSection(sectionId) { 
    document
      .querySelectorAll("main section")
      .forEach((sec) => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    if(window.innerWidth < 768){
      document.querySelector(".nav").classList.remove("active");
    }
  },

  showLoginBtn() {
    let islogin = Auth.isLoggedIn();
    document.querySelector("#loginbtn").style.display = islogin
      ? "none"
      : "inline flex";
    document.querySelector("#logoutbtn").style.display = islogin
      ? "inline flex"
      : "none";
    
  },

  setupMenuToggle() {
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector(".nav");

    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  },

  cacheElements() {
    // catching elements
    this.bankList = document.querySelector("#bankList");
    this.accountList = document.querySelectorAll(".accountList");
    this.transactionList = document.querySelector("#transactionList");
    this.fromAccountList = document.querySelector("#fromAccount");
    this.toAccountList = document.querySelector("#toAccount");
    this.renderTransactions()
  },

  renderBankList() {
    const banks = Bank.getAllBanks();
    this.bankList.innerHTML = banks
      .map((b) => {
        return `
        <option value="${b.id}">
            ${b.name}  
        </option>`;
      })
      .join("");
  },

  async renderAccounts() {
    let accounts = await Auth.userThisBankAccounts();
    this.accountList.forEach((accList) =>{ accList.innerHTML = accounts
      .map((acc) => {
        return `
      <option value="${acc.id}" class="account-item" >
        ${acc.owner} -( ${String(acc.balence.toLocaleString())} تومان ) 
      </option>`;
      })
      .join("");
     })
  },

  renderAccount() {
    let acc = Auth.currentAccount
  
    document.querySelector("#account-info").innerHTML=`
          <h3>اطلاعات حساب</h3>
          <div class="info-box">
            <p>
              <strong>شماره حساب:</strong>
              <span id="accountNumber">${acc.id}</span>
            </p>
            <p>
              <strong>نوع حساب:</strong> <span id="accountType">${acc.constructor.name==="SavingAccount"? "حساب پس انداز" : "حساب جاری" }</span>
            </p>
            <p>
              <strong>موجودی:</strong>
              <span id="accountBalance">${ acc.balence.toLocaleString()} تومان</span>
            </p>
          </div>`
  },

  async renderDasbourdTransactions(account= Auth.currentAccount) {
    
    let transactions = await Transaction.loadAccountsTransactionsById(
      account.id
    );

    document.querySelector("#dashboard .transaction-list").innerHTML =
      [...transactions].reverse()
        .map((tx) => {
          return `
            <div class="transaction-card">
              <div class="transaction-header">
                <h3 class="${Transaction.typeOfTxForAccount( tx, account.id )}"> 
                  ${Transaction.typeOfTxForAccountFARSI( tx, account.id)}
                </h3>
                <span class="amount">${tx.amount.toLocaleString()}تومان</span>
              </div>
              <span>از: ${tx.fromAccount.id} (${tx.fromAccount.owner})</span>
              <br>
              <span>به: ${tx.toAccount.id} (${tx.toAccount.owner})</span>
              <br>
              <p>تاریخ: ${tx.date.getFullYear()}:${ tx.date.getMonth()}:${ tx.date.getDate() } ساعت : ${ tx.date.getHours()}:${tx.date.getMinutes()}</p>
            </div>
         `;
        })
        .join("");
  },




  async renderTransactions(account) {
    let transactions = await Auth.allTransactions();

      this.transactionList.innerHTML = [...transactions].reverse()
        .map((tx) => {
          return `
          <div class="transaction-card">
             <div class="transaction-header">
               <h3>

               </h3>
               <span class="amount expense">${tx.amount.toLocaleString()} تومان</span>
             </div>
             <br>
             <span>از:${tx.fromAccount.owner} (شماره حساب :${tx.fromAccount.id} , بانک :${Bank.findBankById(tx.fromAccount.bankId)?Bank.findBankById(tx.fromAccount.bankId).name:"نامشخص"})</span>
             <br>
             <span>به:${tx.toAccount.owner} (شماره حساب :${tx.toAccount.id}  , بانک :${Bank.findBankById(tx.toAccount.bankId)?Bank.findBankById(tx.toAccount.bankId).name:"نامشخص"})</span>
             <p class="transaction-date">تاریخ: ${tx.date.getFullYear()}:${ tx.date.getMonth()}:${ tx.date.getDate() } ساعت : ${ tx.date.getHours()}:${tx.date.getMinutes()}</p>
          </div>
        `;
        })
        .join("");
    
  },



  rendershowDLTAccountDescription() {
    let currentAccount = Auth.currentAccount
    document
      .querySelector("#showDLTAccountDescription")
      .innerHTML = `
      <h2 class="section-title">آیا مطمئن هستید؟<input id="agreeDeleteAccountInput" type="checkbox"></h2>
      <div class="info-box">
      <br>
        <p>
          <strong>شماره حساب:</strong>
          <span id="accountNumber">${currentAccount.id}</span>
        </p>
        <p>
          <strong>نوع حساب:</strong> <span id="accountType">${currentAccount.constructor.name==="SavingAccount"? "حساب پس انداز" : "حساب جاری" }</span>
        </p>
        <p>
          <strong>موجودی:</strong>
          <span id="accountBalance">${ currentAccount.balence.toLocaleString()} تومان</span>
        </p>
      </div>
      <br><br>`
  },


///// TRANSFER FORM /////

  async renderFromAcc() {
    let accounts = await Auth.userThisBankAccounts();
    this.fromAccountList.innerHTML = accounts
      .map((acc) => {
        return `
      <option value="${acc.id}" class="account-item" >
        ${acc.owner} -( ${String(acc.balence.toLocaleString())} تومان ) 
      </option>`;
      })
      .join("");
  },

  renderToAcc() {
    let accounts = Bank.allAccounts;
    this.toAccountList.innerHTML = accounts
      .map((acc) => {
        if(acc.id ==="account-has-been-deleted") return
        return `
      <option value="${acc.id}" class="account-item" >
        ${acc.owner} -( ${String(acc.balence.toLocaleString())} تومان ) 
      </option>`;
      })
      .join("");
  },

  renderForm() {
    this.renderFromAcc();
    this.renderToAcc();
  },

  renderUpdate() {
    this.renderAccounts();
    this.renderForm();
  },


  /////MSG////

  showError(msg) {
    alert(msg);
  },

  showMsg(msg) {
    alert(msg);
  },

  refresh() {
    this.renderAccounts(Bank.findUsersAccounts(Auth.currentUser));
  },

  showDashboard() {
    this.showSection("dashboard");
  
    this.renderElements()
  },

  renderWelcome(){
    let name = Auth.currentUser.username

    document
      .querySelector("#welcome")
      .innerHTML= `خوش آمدید ${name}`

  },


};
