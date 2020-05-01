class State {
  currentQuestion: number;
  entryWindow: boolean;
  quizFinished: boolean;
  givenUp: boolean;
  time: number;
  interval: number;

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
    this.time = 0;
    this.interval = null;
  }
}

export default State;
