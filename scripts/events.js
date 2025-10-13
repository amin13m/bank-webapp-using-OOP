
import { UI } from "./ui.js"
import { Bank} from "../models/Bank.js"
import { BankAPI } from "../scripts/api.js"

export const Events = {
  init() {
    this.bindUIEvents();
    console.log("🎯 Event handlers فعال شدند");
  },

  bindUIEvents() {
    document
      .querySelector("#bankList")
      .addEventListener("change", this.handleBankSelect);
    document
      .querySelector("#transferForm")
      .addEventListener("submit", this.handleTransfer);
    document
      .querySelector("#accountList")
      .addEventListener("change", this.handleAccountSelect);
    document
      .querySelector("nav")
      .addEventListener("click", this.navHandler);
    document
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", this.navHandler));
    },

  async handleBankSelect(e) {
    const bankId = e.target.value;
    const accounts = await Bank.getAccountsByBank(bankId);
    UI.renderAccounts(accounts);
  },

  handleAccountSelect(e) {
    const accountId = e.target.value;
    const account = Bank.findAccountById(accountId);
    UI.renderAccounts(account);
  },

  async handleTransfer(e) {
    e.preventDefault();
    const fromId = document.querySelector("#fromId").value;
    const toId = document.querySelector("#toId").value;
    const amount = Number(document.querySelector("#amount").value);

    try {
      await Bank.transfer(fromId, toId, amount);
      const accounts = Bank.getAllAccountsInSystem();
      UI.renderAccounts(accounts);
      alert("✅ انتقال با موفقیت انجام شد!");
    } catch (err) {
      console.error(err);
      UI.showError("خطا در انجام تراکنش");
    }
  },

  navHandler(e) {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") return;
    const sectionId = e.target.dataset.section;
    UI.showSection(sectionId);
  }

};
