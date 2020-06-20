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
  // static openDB = (): IDBOpenDBRequest => {
  //   const request: IDBOpenDBRequest = window.indexedDB.open(name, version);
  //   let db: IDBDatabase;
  //   let store: IDBObjectStore;
  //   let index: IDBIndex;

  //   request.onupgradeneeded = () => {
  //     db = request.result;
  //     store = db.createObjectStore(storeName, { autoIncrement: true });
  //     index = store.createIndex("totalTime", "totalTime", { unique: false });
  //   };

  //   return request;
  // };

  // static addQuizScoreRaw = (time: number) => {
  //   const request: IDBOpenDBRequest = Scores.openDB();

  //   let db: IDBDatabase;
  //   let store: IDBObjectStore;
  //   let index: IDBIndex;
  //   let transaction: IDBTransaction;

  //   request.onsuccess = () => {
  //     db = request.result;
  //     transaction = db.transaction(storeName, "readwrite");
  //     store = transaction.objectStore(storeName);
  //     index = store.index("totalTime");

  //     const timeStr = numberToTime(time);

  //     store.put({
  //       totalTime: timeStr,
  //     });

  //     transaction.oncomplete = () => {
  //       db.close();
  //     };
  //   };
  // };

  // static getTimes = (questions: Question[]): string[] => {
  //   const times = new Array<string>(questions.length);
  //   let i = 0;
  //   questions.forEach((q) => {
  //     times[i] = q.getTime().toString();
  //     i++;
  //   });
  //   return times;
  // };

  // static getPenalties = (
  //   questions: Question[],
  //   answers: AnswerContainer
  // ): string[] => {
  //   const penalties = new Array<string>(questions.length);
  //   let i = 0;
  //   questions.forEach((q) => {
  //     penalties[i] = q.checkAnswer(answers.getAnswer(q.questionId)).toString();
  //     i++;
  //   });
  //   return penalties;
  // };

  // static addQuizScoreDetailed(
  //   questions: Question[],
  //   answers: AnswerContainer,
  //   time: number
  // ) {
  //   const request = Scores.openDB();

  //   let db: IDBDatabase;
  //   let store: IDBObjectStore;
  //   let index: IDBIndex;
  //   let transaction: IDBTransaction;

  //   request.onsuccess = () => {
  //     db = request.result;
  //     transaction = db.transaction(storeName, "readwrite");
  //     store = transaction.objectStore(storeName);
  //     index = store.index("totalTime");

  //     const timeStr = numberToTime(time);

  //     const userAnswersTimes = Scores.getTimes(questions);

  //     const userPenalties = Scores.getPenalties(questions, answers);

  //     store.put({
  //       totalTime: timeStr,
  //       questionsTimes: userAnswersTimes,
  //       correctness: userPenalties,
  //     });

  //     transaction.oncomplete = () => {
  //       db.close();
  //     };
  //   };
  // }

  private static countTimes = (
    questions: Question[],
    time: number
  ): number[] => {
    const times = new Array();
    questions.forEach((q) => {
      times.push((time * 100) / q.getTime());
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
    });
  }

  // static extractScores(fun, rendered: (HTMLElement) => void) {
  //   const request = Scores.openDB();
  //   let db: IDBDatabase;
  //   let store: IDBObjectStore;
  //   let index: IDBIndex;
  //   let transaction: IDBTransaction;

  //   request.onsuccess = () => {
  //     db = request.result;
  //     transaction = db.transaction(storeName, "readwrite");
  //     store = transaction.objectStore(storeName);
  //     index = store.index("totalTime");

  //     const getAllRequest: IDBRequest<any[]> = index.getAll();

  //     getAllRequest.onsuccess = () => {
  //       const res: ScoresRecord[] = getAllRequest.result;
  //       const times = Array(res.length);
  //       let i = 0;
  //       res.forEach((record) => {
  //         times[i] = record.totalTime;
  //         i++;
  //       });

  //       console.log(times);

  //       fun(times, rendered);
  //     };
  //   };
  // }
}

export default Scores;
