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

  public get introduction(): string {
    return this.#introduction;
  }

  public set questions(v: QuestionTemplate[]) {
    this.#questions = v;
  }
}

export default IdQuiz;
