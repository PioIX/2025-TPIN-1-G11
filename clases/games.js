let idGame = 1; 

class Games{
    constructor(idUser, score){
        this.id= idGame;
        idGame++;
        this.idUser=idUser;
        this.score=score;
        this.win = true;
    }
}