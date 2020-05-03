import { QuestionTemplate } from "../templates/QuestionTemplate.js";
import AnswerContainer from "./AnswerContainer.js";
import Timer from "./Timer.js";

class Question {
  private question: string;
  private correctAswer: string;
  private penalty: number;
  private id: number;
  private answerContainer: AnswerContainer;
  private timer: Timer;

  constructor(
    template: QuestionTemplate,
    answerContainer: AnswerContainer,
    id: number
  ) {
    this.question = template.question;
    this.correctAswer = template.answer;
    this.penalty = template.penalty;
    this.id = id;
    this.answerContainer = answerContainer;
    this.timer = new Timer();
  }

  public get correctAnswer(): string {
    return this.correctAnswer;
  }

  render(): HTMLElement {
    let questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    let questionText = document.createElement("h2");
    questionText.className = "question-text";
    questionText.textContent =
      this.question +
      " = ? Time penalty for incorrect answer is " +
      this.penalty;

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
  }

  checkAnswer(answer: string): number {
    if (answer === this.correctAswer) {
      return 0;
    }
    return this.penalty;
  }
}

export default Question;
