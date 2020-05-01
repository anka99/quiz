import { QuestionTemplate } from "./QuestionTemplate.js";

export interface QuizTemplate {
  quiz_title: string;
  questions: QuestionTemplate[];
}
