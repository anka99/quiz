class AnswerContainer {
  private _answers: string[];
  private filled: number;

  constructor(length: number) {
    this._answers = new Array(length);
    for (let i = 0; i < this._answers.length; i++) {
      this._answers[i] = "empty";
    }
    this.filled = 0;
  }

  public get answers(): string[] {
    return this._answers;
  }

  getAnswer(i: number) {
    return this._answers[i];
  }

  private validAnswer(answer: string): boolean {
    if (answer.length < 1 || answer === "-") {
      return false;
    }
    const regex = new RegExp("^(-?)[0-9]*$");
    return regex.test(answer);
  }

  actualizeAswer = (i: number) => (ev) => {
    const strAnswer = ev.target.value.trim();
    if (this.validAnswer(strAnswer)) {
      if (this._answers[i] === "empty") {
        this.filled++;
      }
      this._answers[i] = strAnswer;
    } else {
      if (this._answers[i] !== "empty") {
        this.filled--;
      }
      this._answers[i] = "empty";
    }
    this.render();
  };

  clear() {
    this._answers = new Array(this._answers.length);
    for (let i = 0; i < this._answers.length; i++) {
      this._answers[i] = "empty";
    }
    this.filled = 0;
  }

  renderBar(): HTMLElement {
    const bar = document.createElement("div");
    bar.setAttribute("class", "answer-bar");
    const barItems = new Array(length);
    let i = 0;
    this._answers.forEach((a) => {
      i++;
      const el = document.createElement("div");
      const num = document.createElement("h2");
      num.innerText = i.toString();
      if (this._answers[i - 1] == "empty") {
        el.setAttribute("class", "bar-item");
      } else {
        el.setAttribute("class", "bar-item-empty");
      }
      el.appendChild(num);
      bar.appendChild(el);
    });

    return bar;
  }

  renderPreviousAnswer(i: number): HTMLElement {
    const el = document.createElement("div");
    if (this._answers[i] != "empty") {
      el.setAttribute("class", "prev-ans");
      const text = document.createElement("h2");
      text.innerText = "Your answer:\n" + this._answers[i];
      el.appendChild(text);
    }
    return el;
  }

  render() {
    const finishButton = document.getElementById("finish");

    if (finishButton) {
      if (this.filled == this._answers.length) {
        finishButton.removeAttribute("disabled");
      } else {
        finishButton.setAttribute("disabled", "yes");
      }
    }
  }
}

export default AnswerContainer;
