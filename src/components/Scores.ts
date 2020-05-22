import { numberToTime } from "../tools/timeTools.js";
import Question from "./Question.js";
import AnswerContainer from "./AnswerContainer.js";

const key = "scores";
const quizSpliterator = "#";
export const timeSpliterator = "|";
const token = "token";

class Scores {
  public static putToken() {
    localStorage.setItem(token, token);
  }

  public static tryAcquireToken(): string {
    if (!localStorage.getItem(token)) {
      return null;
    }
    return token;
  }
  private static acquireToken(): void {
    let t = localStorage.getItem(token);
    while (!t) {
      t = localStorage.getItem(token);
    }
  }

  static addQuizScoreRaw(time: number) {
    this.acquireToken();
    let item = localStorage.getItem(key);
    if (item === null) {
      item = numberToTime(time);
    } else {
      item = item + quizSpliterator + numberToTime(time);
    }
    console.log(item);
    localStorage.setItem(key, item);
    this.putToken();
  }

  private static questionScoreString = (
    question: Question,
    answers: AnswerContainer
  ) => {
    let time = question.getTime().toString();
    let correct: string;
    let penalty: string;
    if (question.checkAnswer(answers.getAnswer(question.questionId)) > 0) {
      correct = "no";
      penalty = question.getPenalty().toString();
    } else {
      correct = "yes";
      penalty = "0";
    }
    return time + "," + penalty + "," + correct;
  };

  static addQuizScoreDetailed(
    questions: Question[],
    answers: AnswerContainer,
    time: number
  ) {
    this.acquireToken();
    let item = localStorage.getItem(key);
    let newScore = numberToTime(time) + "|";
    questions.forEach((q) => {
      if (newScore !== numberToTime(time) + "|") {
        newScore = newScore + ";";
      }
      newScore = newScore + this.questionScoreString(q, answers);
    });

    if (item === null) {
      item = newScore;
    } else {
      item = item + quizSpliterator + newScore;
    }
    console.log(item);
    localStorage.setItem(key, item);
    this.putToken();
  }

  static getScores(): string[] {
    let item = localStorage.getItem(key);
    if (item !== null) {
      return item.split(quizSpliterator);
    }
    return null;
  }
}

export default Scores;
