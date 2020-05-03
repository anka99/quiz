class State {
  currentQuestion: number;
  entryWindow: boolean;
  quizFinished: boolean;
  givenUp: boolean;
  scoresWindow: boolean;

  constructor(
    currentQuestion: number,
    entryWindow: boolean,
    quizFinished: boolean,
    givenUp: boolean,
    scoreWindow: boolean
  ) {
    this.currentQuestion = currentQuestion;
    this.entryWindow = entryWindow;
    this.quizFinished = quizFinished;
    this.givenUp = givenUp;
    this.scoresWindow = scoreWindow;
  }
}

export default State;
