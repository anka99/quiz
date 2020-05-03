import Question from "./Question.js";
import { QuizTemplate } from "../templates/QuizTemplate.js";
import EntryWindow from "./EntryWindow.js";
import State from "./State.js";
import Button from "./Button.js";
import AnswerContainer from "./AnswerContainer.js";
import GiveUpWindow from "./GiveUpWindow.js";
import FinishedWindow from "./FinishedWindow.js";
import Timer from "./Timer.js";
import Scores from "./Scores.js";

class Quiz {
  private questions: Array<Question>;
  private title: string;
  private state: State;

  //Buttons:
  private nextButton: Button;
  private backButton: Button;
  private giveUpButton: Button;
  private finishQuizButton: Button;
  private restartButton: Button;
  private startButton: Button;
  private scoresButton: Button;

  private answers: AnswerContainer;
  private timer: Timer;
  private entryWindow: EntryWindow;
  private giveUpWindow: GiveUpWindow;

  constructor(template: QuizTemplate) {
    this.title = template.quiz_title;
    this.questions = new Array(template.questions.length);
    this.state = new State(0, true, false, false, false);
    this.entryWindow = new EntryWindow();
    this.timer = new Timer();
    this.giveUpWindow = new GiveUpWindow();

    this.startButton = new Button(
      "start",
      "start",
      "start",
      this.rerender(false, 0, false, false, false, this.timer.start)
    );

    this.backButton = new Button(
      "back",
      "back",
      "back",
      this.rerender(false, -1, false, false, false, () => {})
    );

    this.nextButton = new Button(
      "next",
      "next",
      "next",
      this.rerender(false, 1, false, false, false, () => {})
    );

    this.giveUpButton = new Button(
      "giveup",
      "giveup",
      "give up",
      this.rerender(false, 0, true, false, false, this.timer.stop)
    );

    this.finishQuizButton = new Button(
      "finish",
      "finish",
      "finish",
      this.rerender(false, 0, false, true, false, this.timer.stop)
    );

    this.restartButton = new Button(
      "start",
      "restart",
      "back to start",
      this.restart
    );

    this.scoresButton = new Button(
      "scoresbtn",
      "scoresbtn",
      "scores",
      this.rerender(false, 0, false, false, true, () => {})
    );

    this.answers = new AnswerContainer(this.questions.length);

    let i = 0;
    template.questions.forEach((element) => {
      this.questions[i] = new Question(element, this.answers, i);
      i++;
    });
  }

  private renderCurrentQuestion = () => {
    return this.questions[this.state.currentQuestion].render();
  };

  private rerender = (
    entryWindow: boolean,
    increaseQuestion: number,
    givenUp: boolean,
    quizFinished: boolean,
    scoresWindow: boolean,
    timeOperation: () => void
  ) => () => {
    this.state = new State(
      this.state.currentQuestion + increaseQuestion,
      entryWindow,
      quizFinished,
      givenUp,
      scoresWindow
    );
    timeOperation();
    this.render();
  };

  private restart = () => {
    this.answers.clear();
    this.state.currentQuestion = 0;
    this.rerender(true, 0, false, false, false, this.timer.reset)();
  };

  private countTime(): number {
    let time = this.timer.seconds;
    let i = 0;
    this.questions.forEach((q) => {
      time += q.checkAnswer(this.answers.getAnswer(i));
      i++;
    });
    return time;
  }

  renderHeader() {
    let headerDiv = document.createElement("div");
    let header = document.createElement("h1");
    headerDiv.setAttribute("class", "header");
    header.innerText = this.title;
    headerDiv.appendChild(header);
    return headerDiv;
  }

  render() {
    let rendered = document.createElement("div");
    rendered.setAttribute("class", "main-page-grid");
    rendered.setAttribute("id", "main-page-grid");
    rendered.appendChild(this.renderHeader());

    if (this.state.entryWindow) {
      rendered.appendChild(this.entryWindow.render());
      rendered.appendChild(this.startButton.render());
      rendered.appendChild(this.scoresButton.render());
    } else if (this.state.givenUp) {
      rendered.appendChild(this.giveUpWindow.render());
      rendered.appendChild(this.restartButton.render());
      rendered.appendChild(this.scoresButton.render());
    } else if (this.state.quizFinished) {
      let time = this.countTime();
      rendered.appendChild(FinishedWindow.render(time));
      rendered.appendChild(this.restartButton.render());
      rendered.appendChild(this.scoresButton.render());
    } else if (this.state.scoresWindow) {
      rendered.appendChild(Scores.render());
      rendered.appendChild(this.restartButton.render());
    } else {
      rendered.appendChild(
        this.answers.renderPreviousAnswer(this.state.currentQuestion)
      );
      rendered.appendChild(this.timer.render());
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

    if (!this.state.givenUp && !this.state.entryWindow) {
      this.answers.render();
    }
  }
}

export default Quiz;
