class State {
  currentQuestion: number;
  renderMode: string;

  constructor(currentQuestion: number, renderMode: string) {
    this.currentQuestion = currentQuestion;
    this.renderMode = renderMode;
  }
}

export default State;
