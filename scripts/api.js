
let url = "http://localhost:3000/"

export const BankAPI ={

    ///GET
    async getAccounts(bank) {
        return fetch(`${url}/banks/?name=${bank}/accounts`).then(res => res.json())
    },
    async getBanks() {
        return fetch(`${url}/banks`).then(res => res.json())
    },
    async getAccount(bank,id) {
        return fetch(`${url}/banks/?name=${bank}/accounts/?id=${id}`).then(res => res.json())
    },

    ///PUT
    async addAccount(bank ,account) {
        return fetch(`${url}/banks/?name=${bank}/accounts`, {
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