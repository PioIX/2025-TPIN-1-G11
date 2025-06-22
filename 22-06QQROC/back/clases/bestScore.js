let idBestScore = 1; 

class BestScore{
    constructor(idUser, score, win=true){
        this.id= idBestScore;
        idBestScore++;
        this.idUser=idUser;
        this.score=score;
        this.win = win;
    }
}