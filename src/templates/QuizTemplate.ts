import { QuestionTemplate } from "./QuestionTemplate.js";

export interface QuizTemplate {
  id: number;
  introduction: string;
  questions: QuestionTemplate[];
}
