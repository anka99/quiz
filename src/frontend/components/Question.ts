import { QuestionTemplate } from "../../templates/QuestionTemplate.js";
import AnswerContainer from "./AnswerContainer.js";
import Timer from "./Timer.js";

class Question {
  private question: string;
  private correctAswer: string;
  private penalty: number;
  private id: number;
  private answerContainer: AnswerContainer;
  private timer: Timer;

  constructor(template: QuestionTemplate, answerContainer: AnswerContainer) {
    this.question = template.question;
    this.correctAswer = template.answer;
    this.penalty = template.penalty;
    this.id = template.id;
    this.answerContainer = answerContainer;
    this.timer = new Timer("question-timer-place");
  }

  public get correctAnswer(): string {
    return this.correctAnswer;
  }

  public get questionId(): number {
    return this.id;
  }

  stopTimer = (): void => {
    this.timer.stop();
  };

  startTimer = (): void => {
    this.timer.start();
  };

  resetTimer = (): void => {
    this.timer.reset();
  };

  getTime = (): number => {
    return this.timer.seconds;
  };

  getPenalty = (): number => {
    return this.penalty;
  };

  getContet = (): string => {
    return this.question;
  };

  checkAnswer = (answer: string): number => {
    if (answer === this.correctAswer) {
      return 0;
    }
    return this.penalty;
  };

  render = (): HTMLElement => {
    let questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    let questionText = document.createElement("h2");
    questionText.className = "question-text";
    questionText.textContent =
      this.question +
      " = ? Time penalty for incorrect answer is " +
      this.penalty +
      " seconds";

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.setAttribute("class", "input");

    questionInput.addEventListener(
      "input",
      this.answerContainer.actualizeAswer(this.id)
    );

    questionContainer.appendChild(questionText);
    questionContainer.appendChild(questionInput);
    return questionContainer;
  };
}

export default Question;
