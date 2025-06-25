let idQuestion = 1; 

class Question {
    constructor(content, answer1, answer2, answer3, answer4, correctAnswer, emoji, text, fifty){
        this.id = idQuestion;
        idQuestion ++;
        this.content=content;
        this.answer1=answer1;
        this.answer2=answer2;
        this.answer3=answer3;
        this.answer4=answer4;
        this.correctAnswer=correctAnswer;
        this.emoji=emoji;
        this.text=text;
        this.fifty=fifty
    }

    emojiClue(){

    }

    textClue(){

    }
    
    fiftyClue(){

    }
}