import Question from "./Question.js";
import { QuizTemplate } from "../templates/QuizTemplate.js";
import EntryWindow from "./EntryWindow.js";
import State from "./State.js";
import Button from "./Button.js";
import AnswerContainer from "./AnswerContainer.js";
import GiveUpWindow from "./GiveUpWindow.js";
import FinishedWindow from "./FinishedWindow.js";
import Timer from "./Timer.js";

class Quiz {
  private questions: Array<Question>;
  private introduction: string;
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
    this.introduction = template.introduction;
    this.questions = new Array(template.questions.length);
    this.state = new State(0, true, false, false, false, false);
    this.entryWindow = new EntryWindow();
    this.timer = new Timer("timer-place");
    this.giveUpWindow = new GiveUpWindow();
    this.answers = new AnswerContainer(this.questions.length);

    let i = 0;
    template.questions.forEach((element) => {
      this.questions[i] = new Question(element, this.answers, i);
      i++;
    });

    this.startButton = new Button(
      "start",
      "start",
      "start",
      this.rerender(false, 0, false, false, false, false, this.startTimers)
    );

    this.backButton = new Button(
      "back",
      "back",
      "back",
      this.rerender(
        false,
        -1,
        false,
        false,
        false,
        false,
        this.changeQuestionsTimers(-1)
      )
    );

    this.nextButton = new Button(
      "next",
      "next",
      "next",
      this.rerender(
        false,
        1,
        false,
        false,
        false,
        false,
        this.changeQuestionsTimers(1)
      )
    );

    this.giveUpButton = new Button(
      "giveup",
      "giveup",
      "give up",
      this.rerender(false, 0, true, false, false, false, this.stopTimers)
    );

    this.finishQuizButton = new Button(
      "finish",
      "finish",
      "finish",
      this.rerender(false, 0, false, true, false, false, this.stopTimers)
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
      this.rerender(false, 0, false, false, true, false, () => {})
    );
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
    this.questions[this.state.currentQuestion].startTimer(); //start current question timer
    this.questions[this.state.currentQuestion - increaseQuestion].stopTimer(); //freeze previous question timer
  };

  private rerender = (
    entryWindow: boolean,
    increaseQuestion: number,
    givenUp: boolean,
    quizFinished: boolean,
    scoresWindow: boolean,
    questionScore: boolean,
    timeOperation: () => void
  ) => () => {
    this.state = new State(
      this.state.currentQuestion + increaseQuestion,
      entryWindow,
      quizFinished,
      givenUp,
      scoresWindow,
      questionScore
    );
    timeOperation();
    this.render();
  };

  private restart = () => {
    this.answers.clear();
    this.state.currentQuestion = 0;
    this.rerender(true, 0, false, false, false, false, this.timer.reset)();
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
    let introduction = document.createElement("h1");
    headerDiv.setAttribute("class", "header");
    introduction.innerText = this.introduction;
    headerDiv.appendChild(introduction);
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
      let finishedWindow = new FinishedWindow(
        this.questions,
        this.answers,
        time,
        this.restart
      );
      rendered.appendChild(finishedWindow.render());
      rendered.appendChild(finishedWindow.renderSaveRawButton());
      rendered.appendChild(finishedWindow.renderSaveStatsButton());
      // rendered.appendChild(this.restartButton.render());
      // rendered.appendChild(this.scoresButton.render());
    }
    // else if (this.state.scoresWindow) {
    //   rendered.appendChild(Scores.render());
    //   rendered.appendChild(this.restartButton.render());
    // }
    else {
      rendered.appendChild(
        this.answers.renderPreviousAnswer(this.state.currentQuestion)
      );
      rendered.appendChild(this.timer.render());
      // rendered.appendChild(
      //   this.questions[this.state.currentQuestion].timer.render()
      // ); //DEBUG
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
