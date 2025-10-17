import { BankAPI } from "../scripts/api.js"
import { Bank } from "./Bank.js"
import { User } from "./User.js"

export let Auth = {
    currentUser: null,
    currentAccount: null,
    currentBank: async()=>await Bank.findBankByName("mybank"),
    userThisBankAccounts: async ()=>(await Auth.currentBank()).findUsersAccounts(Auth.currentUser.username),

    async login(username, password) {
        let allUsers = await BankAPI.getAllUsers()
        let found = allUsers.find(u=>{
            return u.username === username && u.password === password
        })

        if(!found) throw new Error("wrong password or username");

        this.currentUser = new User(found.id, found.username, found.password, found.role);
        localStorage.setItem("currentUser", JSON.stringify(found));
        
        return this.currentUser
    },

    async register(username , password, role = "user") {
        let newUser = new User(undefined, username, password, role);
        
        await BankAPI.addUser(newUser);

        this.currentUser = newUser
        localStorage.setItem("currentUser", JSON.stringify(newUser.toJSON()));

        return this.currentUser
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem("currentUser");
    },

    loadUser() {
        let data = localStorage.getItem("currentUser");
        if(data){
            this.currentUser = User.fromJSON(JSON.parse(data));
        }
        return this.currentUser
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    async isUsernameExist(username){
        let allUsers =  await BankAPI.getAllUsers();
        return allUsers.find(u=>u.username === username)
    },

}