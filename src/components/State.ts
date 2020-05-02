class State {
  currentQuestion: number;
  entryWindow: boolean;
  quizFinished: boolean;
  givenUp: boolean;

  constructor(
    currentQuestion: number,
    entryWindow: boolean,
    quizFinished: boolean,
    givenUp: boolean
  ) {
    this.currentQuestion = currentQuestion;
    this.entryWindow = entryWindow;
    this.quizFinished = quizFinished;
    this.givenUp = givenUp;
  }
}

export default State;
