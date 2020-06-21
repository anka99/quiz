import { QuizTemplate } from "./QuizTemplate";

export interface UserScore {
  quiz: QuizTemplate;
  score: number;
  user_answers: string[];
}
