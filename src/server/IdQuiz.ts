import { QuizTemplate } from "../templates/QuizTemplate";
import { QuestionTemplate } from "../templates/QuestionTemplate";

class IdQuiz {
  #id: number;
  #introduction: string;
  #questions: QuestionTemplate[];
  constructor(id: number, description: string) {
    this.#id = id;
    this.#introduction = description;
    this.#questions = new Array();
  }

  public get id(): number {
    return this.#id;
  }
}

export default IdQuiz;
