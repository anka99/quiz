import { numberToTime } from "../tools/timeTools.js";
import Question from "./Question.js";
import AnswerContainer from "./AnswerContainer.js";

const key = "scores";
const quizSpliterator = "#";
export const timeSpliterator = "|";

class Scores {
  static addQuizScoreRaw(time: number) {
    let item = localStorage.getItem(key);
    if (item === null) {
      item = numberToTime(time);
    } else {
      item = item + quizSpliterator + numberToTime(time);
    }
    localStorage.setItem(key, item);
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
    localStorage.setItem(key, item);
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
