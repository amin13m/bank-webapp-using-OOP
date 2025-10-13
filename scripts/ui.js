
import { Bank } from "../models/Bank.js";

export const UI = {
  init() {    
    this.cacheElements();
    this.setupNavigation();
    this.setupMenuToggle();
    this.renderBankList();
    console.log("🖥️ UI آماده شد");
  },

  setupNavigation() {
    document.querySelectorAll("header nav button").forEach(btn => {
      btn.addEventListener("click", e => {
        this.showSection(e.target.dataset.section);
      });
    });
  },

  showSection(sectionId) {
    document.querySelectorAll("main section").forEach(sec =>
      sec.classList.remove("active")
    );
    document.getElementById(sectionId).classList.add("active");
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
    this.accountList = document.querySelector("#accountList");
    this.transactionList = document.querySelector("#transactionList");
  },

  renderBankList() {
    const banks = Bank.getAllBanks();
    this.bankList.innerHTML = banks.map((b )=> {
        return `
        <option value="${b.id}">
            ${b.name}
        </option>`
        }).join("");
  },

  renderAccounts(accounts) {
    this.accountList.innerHTML = accounts.map((acc )=> {return`
      <option value="${acc.id}" class="account-item" >
        ${acc.owner} - ${acc.balance.toLocaleString()} ریال
      </option>`}
      )
      .join("");
  },

  renderTransactions(transactions) {
    this.transactionList.innerHTML = transactions
      .map(
        tx => {`
      <div class="transaction-item">
        <span>از: ${tx.fromId}</span>
        <span>به: ${tx.toId}</span>
        <span>مبلغ: ${tx.amount.toLocaleString()} ریال</span>
      </div>
      `})
      .join("");
  },

  showError(msg) {
    alert(msg);
  },

  refresh() {
    this.renderBankList();
  }
};