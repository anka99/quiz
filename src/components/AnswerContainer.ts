class AnswerContainer {
  private answers: string[];
  private filled: number;

  constructor(length: number) {
    this.answers = new Array(length);
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i] = "empty";
    }
    this.filled = 0;
  }

  private validAnswer(answer: string): boolean {
    let regex = new RegExp("^[0-9]*$");
    return regex.test(answer);
  }

  actualizeAswer = (i: number) => (ev) => {
    let strAnswer = ev.target.value.trim();
    if (this.validAnswer(strAnswer)) {
      if (this.answers[i] === "empty") {
        this.filled++;
      }
      this.answers[i] = strAnswer;
    } else {
      if (this.answers[i] !== "empty") {
        this.filled--;
      }
      this.answers[i] = "empty";
    }
    this.render();
  };

  clear() {
    this.answers = new Array(this.answers.length);
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i] = "empty";
    }
    this.filled = 0;
  }

  render() {
    console.log(this.filled);
    console.log(this.answers);
    let finishButton = document.getElementById("finish");
    if (finishButton) {
      if (this.filled == this.answers.length) {
        finishButton.removeAttribute("disabled");
      } else {
        finishButton.setAttribute("disabled", "yes");
      }
    }
  }
}

export default AnswerContainer;
