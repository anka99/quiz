import Question from "./Question.js";
import { QuizTemplate } from "../templates/QuizTemplate.js";
import EntryWindow from "./EntryWindow.js";
import State from "./State.js";
import Button from "./Button.js";
import AnswerContainer from "./AnswerContainer.js";
import GiveUpWindow from "./GiveUpWindow.js";
import FinishedWindow from "./FinishedWindow.js";

class Quiz {
  private questions: Array<Question>;
  private title: string;

  private nextButton: Button;
  private backButton: Button;
  private giveUpButton: Button;
  private finishQuizButton: Button;
  private restartButton: Button;
  private endQuiz: HTMLElement;
  private state: State;
  private startButton: Button;
  private answers: AnswerContainer;

  constructor(template: QuizTemplate) {
    this.title = template.quiz_title;
    this.questions = new Array(template.questions.length);

    this.startButton = new Button(
      "start",
      "start",
      "start",
      this.rerender(false, 0, false, false)
    );

    this.backButton = new Button(
      "back",
      "back",
      "back",
      this.rerender(false, -1, false, false)
    );

    this.nextButton = new Button(
      "next",
      "next",
      "next",
      this.rerender(false, 1, false, false)
    );

    this.giveUpButton = new Button(
      "giveup",
      "giveup",
      "give up",
      this.rerender(false, 0, true, false)
    );

    this.finishQuizButton = new Button(
      "finish",
      "finish",
      "finish",
      this.rerender(false, 0, false, true)
    );

    this.restartButton = new Button(
      "restart",
      "restart",
      "restart",
      this.restart
    );

    this.state = new State(0, true, false, false);

    this.answers = new AnswerContainer(this.questions.length);

    let i = 0;
    template.questions.forEach((element) => {
      this.questions[i] = new Question(element, this.answers, i);
      i++;
    });
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

  private restart = () => {
    this.answers.clear();
    this.state.currentQuestion = 0;
    this.rerender(true, 0, false, false)();
  };

  render() {
    let rendered = document.createElement("div");
    rendered.setAttribute("class", "main-page-grid");
    rendered.setAttribute("id", "main-page-grid");

    if (this.state.entryWindow) {
      rendered.appendChild(EntryWindow.render());
      rendered.appendChild(this.startButton.render());
    } else if (this.state.givenUp) {
      rendered.appendChild(GiveUpWindow.render());
      rendered.appendChild(this.restartButton.render());
    } else if (this.state.quizFinished) {
      rendered.appendChild(FinishedWindow.render());
      rendered.appendChild(this.restartButton.render());
    } else {
      rendered.appendChild(this.renderCurrentQuestion());
      if (this.state.currentQuestion > 0) {
        rendered.appendChild(this.backButton.render());
      }
      rendered.appendChild(this.giveUpButton.render());
      rendered.appendChild(this.finishQuizButton.render());
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

    this.answers.render();
  }
}

export default Quiz;
