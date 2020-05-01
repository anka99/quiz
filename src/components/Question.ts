import { QuestionTemplate } from "../templates/QuestionTemplate.js";
import AnswerContainer from "./AnswerContainer.js";

class Question {
  private question: string;
  private correct_answer: string;
  private users_answer: string;
  private penalty: number;
  private id: number;
  private answerContainer: AnswerContainer;

  constructor(
    template: QuestionTemplate,
    answerContainer: AnswerContainer,
    id: number
  ) {
    this.question = template.question;
    this.correct_answer = template.answer;
    this.users_answer = "";
    this.penalty = template.penalty;
    this.id = id;
    this.answerContainer = answerContainer;
  }

  render(): HTMLElement {
    let questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    let questionPenalty = document.createElement("div");
    questionPenalty.className = "question-penalty";

    let penaltyText = document.createElement("p");
    penaltyText.textContent = "Penalty for incorrect answer is " + this.penalty;
    penaltyText.className = "penalty-text";

    let questionText = document.createElement("p");
    questionText.className = "question-text";
    questionText.textContent = this.question;

    let questionInput = document.createElement("input");
    questionInput.type = "text";

    questionInput.addEventListener(
      "input",
      this.answerContainer.actualizeAswer(this.id)
    );

    questionPenalty.appendChild(penaltyText);
    questionContainer.appendChild(questionText);
    questionContainer.appendChild(questionPenalty);
    questionContainer.appendChild(questionInput);
    return questionContainer;
  }
}

export default Question;
