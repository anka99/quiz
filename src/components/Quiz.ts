import Question from "./Question.js";
import { QuizTemplate } from "../templates/QuizTemplate.js";
import Entry from "./Entry.js";

class Quiz {
  private questions: Array<Question>;
  private title: string;
  private next: HTMLElement;
  private back: HTMLElement;
  private giveUp: HTMLElement;
  private endQuizz: HTMLElement;
  private currentQuestion: number;
  private entryWindow: boolean;
  private quizFinished: boolean;
  private givenUp: boolean;
  private startButton: HTMLElement;

  constructor(template: QuizTemplate) {
    let i = 0;
    this.title = template.quiz_title;
    this.questions = new Array(template.questions.length);

    template.questions.forEach((element) => {
      this.questions[i] = new Question(element);
    });

    this.currentQuestion = 0;
    this.entryWindow = true;
    this.givenUp = false;
    this.startButton = document.createElement("button");
    this.startButton.innerHTML = "start";
    this.startButton.addEventListener("click", this.rerender(false, 0, false));
  }

  private renderCurrentQuestion() {
    return this.questions[this.currentQuestion].render();
  }

  private rerender = (
    entryWindow: boolean,
    currentQuestion: number,
    givenUp: boolean
  ) => () => {
    this.entryWindow = entryWindow;
    this.currentQuestion = currentQuestion;
    this.givenUp = givenUp;
    this.render();
  };

  render() {
    let rendered = document.createElement("div");
    rendered.setAttribute("class", "main-page-grid");
    rendered.setAttribute("id", "main-page-grid");

    if (this.entryWindow) {
      rendered.appendChild(Entry.render());
      rendered.appendChild(this.startButton);
    } else if (this.givenUp) {
      //TODO
    } else {
      rendered.appendChild(this.renderCurrentQuestion());
    }
    document
      .querySelector("body")
      .removeChild(document.getElementById("main-page-grid"));
    document
      .querySelector("body")
      .insertBefore(rendered, document.getElementById("script"));
  }
}

export default Quiz;
