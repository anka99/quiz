import { QuestionTemplate } from "./QuestionTemplate.js";

export interface QuizTemplate {
  introduction: string;
  questions: QuestionTemplate[];
}
