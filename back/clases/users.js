let idUser= 1;
class User {
    constructor(idBestScore, name, email, password){
        this.id = idUser;
        idUser++;
        this.idBestScore = idBestScore;
        this.name = name; 
        this.email= email;
        this.password = password;
    }
}