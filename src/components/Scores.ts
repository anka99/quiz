import { numberToTime } from "../tools/timeTools.js";
import Question from "./Question.js";
import AnswerContainer from "./AnswerContainer.js";

class Scores {
  // private static scoreToString(
  //   question: Question,
  //   answers: AnswerContainer
  // ): string {
  //   let time = question.getTime().toString();
  //   let correct: string;
  //   let penalty: string;
  //   if (question.checkAnswer(answers.getAnswer(question.questionId)) > 0) {
  //     correct = "no";
  //     penalty = question.getPenalty().toString();
  //   } else {
  //     correct = "yes";
  //     penalty = "0";
  //   }
  //   penalty = question
  //     .checkAnswer(answers.getAnswer(question.questionId))
  //     .toString();
  //   return time + "," + correct + "," + penalty;
  // }

  // private static addQuestionScore(
  //   question: Question,
  //   answers: AnswerContainer
  // ) {
  //   let item = localStorage.getItem("scores");
  //   if (item == null) {
  //     item = this.scoreToString(question, answers);
  //   } else {
  //     item = item + ";" + this.scoreToString(question, answers);
  //   }
  //   localStorage.setItem("scores", item);
  // }

  //30#40:20,6,no;14,8,no;56,0,yes#20

  static addQuizScoreRaw(time: number) {
    let item = localStorage.getItem("scores");
    console.log(item);
    if (item === null) {
      item = numberToTime(time);
    } else {
      item = item + "#" + numberToTime(time);
    }
    console.log(item); //DEBUG
    localStorage.setItem("scores", item);
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
    let item = localStorage.getItem("scores");
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
      item = item + "#" + newScore;
    }
    console.log(item); //DEBUG
    localStorage.setItem("scores", newScore);
  }
}

export default Scores;
