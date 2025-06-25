let idUser= 1;
class User {
    constructor(name, username, password){
        this.id = idUser;
        idUser++;
        this.username = username;
        this.name = name; 
        this.password = password;
    }

}

const users = [];
users.push(new User("Vitina", "vitinitaUwU1", "tuvieja123"));
users.push(new User("Sana", "sanita12", "aguanteTwice"));
users.push(new User("Vitina", "a", "a"));