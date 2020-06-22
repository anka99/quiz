import Question from "./Question.js";
import { QuizTemplate } from "../../templates/QuizTemplate.js";
import EntryWindow from "../windows/EntryWindow.js";
import State from "./State.js";
import Button from "./Button.js";
import AnswerContainer from "./AnswerContainer.js";
import GiveUpWindow from "../windows/GiveUpWindow.js";
import FinishedWindow from "../windows/FinishedWindow.js";
import Timer from "./Timer.js";
import {
  ENTRY_WINDOW,
  QUIZ_GIVENUP,
  QUIZ_FINISHED,
  QUIZ_ACTIVE,
  SCORES_WINDOW,
} from "../tools/types.js";
import Scores from "./Scores.js";

class Quiz {
  private id: number;
  private questions: Question[];
  private introduction: string;
  private state: State;

  // Buttons:
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
  private start: boolean;

  constructor(template: QuizTemplate) {
    this.id = template.id;
    this.introduction = template.introduction;
    this.questions = new Array(template.questions.length);
    this.state = new State(0, QUIZ_ACTIVE);
    this.entryWindow = new EntryWindow();
    this.timer = new Timer("timer-place");
    this.giveUpWindow = new GiveUpWindow();
    this.answers = new AnswerContainer(this.questions.length);

    let i = 0;
    template.questions.forEach((element) => {
      this.questions[i] = new Question(element, this.answers);
      i++;
    });

    this.startButton = new Button(
      "start",
      "start",
      "start",
      this.rerender(0, QUIZ_ACTIVE, this.startTimers)
    );

    this.backButton = new Button(
      "back",
      "back",
      "back",
      this.rerender(-1, QUIZ_ACTIVE, this.changeQuestionsTimers(-1))
    );

    this.nextButton = new Button(
      "next",
      "next",
      "next",
      this.rerender(1, QUIZ_ACTIVE, this.changeQuestionsTimers(1))
    );

    this.giveUpButton = new Button("giveup", "giveup", "give up", () => {
      this.rerender(0, QUIZ_GIVENUP, this.stopTimers)();
      Scores.sendGiveUp(this.id);
      this.start = true;
    });

    this.finishQuizButton = new Button("finish", "finish", "finish", () => {
      this.rerender(0, QUIZ_FINISHED, this.stopTimers)();
      Scores.sendQuizScore(
        this.id,
        this.questions,
        this.answers,
        this.timer.seconds
      );
    });

    this.restartButton = new Button("start", "restart", "quit", this.restart);

    this.scoresButton = new Button(
      "scoresbtn",
      "scoresbtn",
      "scores",
      this.rerender(0, SCORES_WINDOW, () => {})
    );

    this.start = true;
  }

  private startTimers = () => {
    this.timer.start();
    this.questions[0].startTimer();
  };

  private stopTimers = () => {
    this.timer.stop();
    this.questions[this.state.currentQuestion].stopTimer();
  };

  private renderCurrentQuestion = () => {
    return this.questions[this.state.currentQuestion].render();
  };

  private changeQuestionsTimers = (increaseQuestion: number) => () => {
    this.questions[this.state.currentQuestion].startTimer(); // start current question timer
    this.questions[this.state.currentQuestion - increaseQuestion].stopTimer(); // freeze previous question timer
  };

  private rerender = (
    increaseQuestion: number,
    renderMode: string,
    timeOperation: () => void
  ) => () => {
    this.state = new State(
      this.state.currentQuestion + increaseQuestion,
      renderMode
    );
    timeOperation();
    this.render();
  };

  private restart = () => {
    this.answers.clear();
    this.state.currentQuestion = 0;
    this.rerender(0, ENTRY_WINDOW, this.timer.reset)();
  };

  private countTime(): number {
    return this.timer.seconds;
  }

  renderHeader() {
    const headerDiv = document.createElement("div");
    const introduction = document.createElement("h1");
    headerDiv.setAttribute("class", "header");
    introduction.innerText = this.introduction;
    headerDiv.appendChild(introduction);
    return headerDiv;
  }

  render() {
    const rendered = document.createElement("div");
    rendered.setAttribute("class", "main-page-grid");
    rendered.setAttribute("id", "main-page-grid");
    rendered.appendChild(this.renderHeader());

    switch (this.state.renderMode) {
      case ENTRY_WINDOW: {
        rendered.appendChild(this.entryWindow.render());
        rendered.appendChild(this.startButton.render());
        rendered.appendChild(this.scoresButton.render());
        break;
      }
      case QUIZ_GIVENUP: {
        // rendered.appendChild(this.giveUpWindow.render());
        // rendered.appendChild(this.restartButton.render());
        // rendered.appendChild(this.scoresButton.render());
        break;
      }
      case QUIZ_FINISHED: {
        const time = this.countTime(); // tu muszę mieć czas bez doliczania kar
        const finishedWindow = new FinishedWindow(
          this.questions,
          this.answers,
          time,
          this.restart
        );
        // rendered.appendChild(finishedWindow.render());
        // rendered.appendChild(finishedWindow.renderSaveRawButton());
        // rendered.appendChild(finishedWindow.renderSaveStatsButton());
        break;
      }
      case SCORES_WINDOW: {
        // const appendWindow = (window: HTMLElement) => {
        //   rendered.appendChild(window);
        // };
        // Scores.extractScores(ScoresWindow.render, appendWindow);
        // rendered.appendChild(this.restartButton.render());
        break;
      }
      case QUIZ_ACTIVE: {
        if (this.start) {
          this.startTimers();
          this.start = false;
        }
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
        break;
      }
    }
    document
      .querySelector("body")
      .removeChild(document.getElementById("main-page-grid"));
    document
      .querySelector("body")
      .insertBefore(rendered, document.getElementById("script"));

    if (this.state.renderMode == QUIZ_ACTIVE) {
      this.answers.render();
    }
  }
}

export default Quiz;
