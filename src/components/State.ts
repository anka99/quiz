class State {
  currentQuestion: number;
  entryWindow: boolean;
  quizFinished: boolean;
  givenUp: boolean;
  scoresWindow: boolean;
  questionScore: boolean;

  constructor(
    currentQuestion: number,
    entryWindow: boolean,
    quizFinished: boolean,
    givenUp: boolean,
    scoreWindow: boolean,
    questionScore: boolean
  ) {
    this.currentQuestion = currentQuestion;
    this.entryWindow = entryWindow;
    this.quizFinished = quizFinished;
    this.givenUp = givenUp;
    this.scoresWindow = scoreWindow;
    this.questionScore = questionScore;
  }
}

export default State;
