import Question from "./Question.js";
import { QuizTemplate } from "../templates/QuizTemplate.js";
import EntryWindow from "./EntryWindow.js";
import State from "./State.js";
import Button from "./Button.js";

class Quiz {
  private questions: Array<Question>;
  private title: string;
  private nextButton: Button;
  private backButton: Button;
  private giveUpButton: Button;
  private finishQuizButton: Button;
  private endQuiz: HTMLElement;
  private state: State;
  private startButton: Button;

  constructor(template: QuizTemplate) {
    let i = 0;
    this.title = template.quiz_title;
    this.questions = new Array(template.questions.length);

    template.questions.forEach((element) => {
      this.questions[i] = new Question(element);
      i++;
    });

    this.startButton = new Button(
      "start",
      "start",
      this.rerender(false, 0, false, false)
    );

    this.backButton = new Button(
      "back",
      "back",
      this.rerender(false, -1, false, false)
    );

    this.nextButton = new Button(
      "next",
      "next",
      this.rerender(false, 1, false, false)
    );

    this.state = new State(0, true, false, false);
  }

  private renderCurrentQuestion() {
    return this.questions[this.state.currentQuestion].render();
  }

  private rerender = (
    entryWindow: boolean,
    increaseQuestion: number,
    givenUp: boolean,
    quizFinished: boolean
  ) => () => {
    this.state = new State(
      this.state.currentQuestion + increaseQuestion,
      entryWindow,
      quizFinished,
      givenUp
    );
    this.render();
  };

  render() {
    let rendered = document.createElement("div");
    rendered.setAttribute("class", "main-page-grid");
    rendered.setAttribute("id", "main-page-grid");

    if (this.state.entryWindow) {
      rendered.appendChild(EntryWindow.render());
      rendered.appendChild(this.startButton.render());
    } else if (this.state.givenUp) {
      //TODO
    } else if (this.state.quizFinished) {
      //TODO
    } else {
      rendered.appendChild(this.renderCurrentQuestion());
      if (this.state.currentQuestion > 0) {
        rendered.appendChild(this.backButton.render());
      }
      // rendered.appendChild(this.giveUpButton.render());
      if (this.state.currentQuestion < this.questions.length - 1) {
        rendered.appendChild(this.nextButton.render());
      }
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
