import { numberToTime } from "../tools/timeTools.js";
import Question from "./Question.js";
import AnswerContainer from "./AnswerContainer.js";
import { UserAnswers } from "../../templates/UserAnswers.js";

const version: number = 1;
const name: string = "MyQuizScores";
const storeName: string = "ScoresStore";

interface ScoresRecord {
  totalTime: string;
  questionsTimes: string[];
  correctness: string[];
}

class Scores {
  private static countTimes = (
    questions: Question[],
    time: number
  ): number[] => {
    const times = new Array();
    questions.forEach((q) => {
      times.push((q.getTime() * 100) / time);
    });
    return times;
  };

  private static getIds = (questions: Question[]): number[] => {
    const ids = new Array();
    questions.forEach((q) => {
      ids.push(q.questionId);
    });
    return ids;
  };

  public static sendQuizScore(
    quizId: number,
    questions: Question[],
    answers: AnswerContainer,
    time: number
  ) {
    const times = Scores.countTimes(questions, time);
    const ids = Scores.getIds(questions);
    const score: UserAnswers = {
      id: quizId,
      times: times,
      ids: ids,
      answers: answers.answers,
    };
    console.log(JSON.stringify(score));
    fetch("/answers", {
      method: "POST",
      body: JSON.stringify(score),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        window.location.pathname = "/history/" + quizId;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  public static sendGiveUp(quizId: number) {
    fetch("/giveup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        window.location.pathname = "/home";
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}

export default Scores;
