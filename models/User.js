

export class User{
    #id;
    #username;
    #password;
    #role;
    constructor(id, username, password, role = "user") {
        this.#id = id;
        this.#username = username;
        this.#password = password;
        this.#role = role;
    }

    get id(){return this.#id}
    get username(){return this.#username}
    get password(){return this.#password}
    get role(){return this.#role}

    checkPassword(pass) {
        return this.#password === pass;
    }

    toJSON() {
        return {
          id: this.#id,
          username: this.#username,
          password: this.#password,
          role: this.#role,
        };
    }

    static fromJSON(data) {
        return new User(data.id, data.username, data.password, data.role);
    }
}