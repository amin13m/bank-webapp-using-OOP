
// json-server --watch db.json

const BASE_URL = "http://localhost:3000";

export const BankAPI = {


  //////////BANK////////

  async getBanks() {
    const res = await fetch(`${BASE_URL}/banks`);
    return await res.json();
  },

  async getBankById(id) {
    const res = await fetch(`${BASE_URL}/banks/${id}`);
    return await res.json();
  },

  async addBank(bank) {
    const res = await fetch(`${BASE_URL}/banks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.serialize(bank.toJSON())),
    });
    return await res.json();
  },

  async updateBank(bank) {
    const res = await fetch(`${BASE_URL}/banks/${bank.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.serialize(bank.toJSON())),
    });
    return await res.json();
  },

  async deleteBank(id) {
    await fetch(`${BASE_URL}/banks/${id}`, { method: "DELETE" });
  },



//////////ACCOUNTS////////
  async getAccounts() {
    const res = await fetch(`${BASE_URL}/accounts`);
    return await res.json();
  },

  async getAccountById(id) {
    const res = await fetch(`${BASE_URL}/accounts/${id}`);
    return await res.json();
  },

  async getAccountsByBank(bankId) {
    //filter accounts
    const res = await fetch(`${BASE_URL}/accounts?bankId=${bankId}`);
    return await res.json();
  },

  async addAccount(account) {
    const res = await fetch(`${BASE_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.serialize(account.toJSON())),
    });
    return await res.json();
  },

  async updateAccount(account) {
    const res = await fetch(`${BASE_URL}/accounts/${account.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.serialize(account.toJSON())),
    }).then(res=> res.json()); 
   
    return await res;
  },

  async deleteAccountById(id) {
    await fetch(`${BASE_URL}/accounts/${id}`, { method: "DELETE" });
  },


  ///////TRANSATIONS///////
  async getAllTransactions() {
    const res = await fetch(`${BASE_URL}/transactions`);
    return await res.json();
  },

  async getTransactionsByAccountId(accountId) {
  const res = await fetch(`${BASE_URL}/transactions`);
  const data = await res.json();

  return data.filter( tx => tx.fromID === accountId || tx.toID === accountId )
  },

  async addTransaction(transaction) {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction.toJSON()),
    })
    return await res.json();
  },



  ////////USER///////

  async getUserById(userId){
    let res =  fetch(`${BASE_URL}/users/${userId}`)
    return await res.json()
  },

  async getAllUsers(){
    return await fetch(`${BASE_URL}/users`).then(res=>res.json());
  },

  async addUser(user){
    let res = fetch(`${BASE_URL}/users`, {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.toJSON())
    }).then(res=>res.json());

    return await res
  },

  updateUser(user){
    fetch(`${BASE_URL}/users/${user.id}`, {
      method:"PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.toJSON())
    })
  },

    ///serialize
    serialize(obj){
        return {...obj }
    },

    
    ///deserialize
    deserialize(obj){
        if(obj._type === "SavingAccount"){
            return new SavingAccount(obj.id , obj.name , obj.password , obj.balence , obj.bankId )
        }else if(obj._type === "CheckingAccount"){
            return new CheckingAccount(obj.id , obj.name , obj.password , obj.balence , obj.bankId )
        }else if(obj._type === "bank"){
            return new Bank(obj.name )
        }else if(obj._type === "transaction"){
            return new BankAccount.Transaction(obj.id, obj.fromID , obj.toID , obj.amount , obj.date)
        }
        else{
            console.log("deserialize faild");
        }
    }
};

























/*
let url = "http://localhost:3000/"

export const BankAPI ={

    ///GET
    async getAccounts(id) {
        return fetch(`${url}/accounts`).then(res => res.json())
    },
    async getBanks() {
        return fetch(`${url}/banks`).then(res => res.json())
    },
    async getAccount(id) {
        return fetch(`${url}/accounts/?id=${id}`).then(res => res.json())
    },

    ///PUT
    async addAccount(,account) {
        return fetch(, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account)
        }).then(res => res.json())
    },

    ///DELETE
    async removeAccount(bank ,id) {
        return fetch(`${url}/banks/?name=${bank}/accounts/?id=${id}`, {
            method: "DELETE"
        }).then(res => res.json())
    },


    ///PATCH
    async updateAccount(bank ,id ,account) {
        return fetch(`${url}/banks/?name=${bank}/accounts/?id=${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account)
        }).then(res => res.json())
    },



    
}
*/
