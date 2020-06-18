import { numberToTime } from "../tools/timeTools.js";
import Question from "./Question.js";
import AnswerContainer from "./AnswerContainer.js";

const version: number = 1;
const name: string = "MyQuizScores";
const storeName: string = "ScoresStore";

interface ScoresRecord {
  totalTime: string;
  questionsTimes: string[];
  correctness: string[];
}

class Scores {
  static openDB = (): IDBOpenDBRequest => {
    const request: IDBOpenDBRequest = window.indexedDB.open(name, version);
    let db: IDBDatabase;
    let store: IDBObjectStore;
    let index: IDBIndex;

    request.onupgradeneeded = () => {
      db = request.result;
      store = db.createObjectStore(storeName, { autoIncrement: true });
      index = store.createIndex("totalTime", "totalTime", { unique: false });
    };

    return request;
  };

  static addQuizScoreRaw = (time: number) => {
    const request: IDBOpenDBRequest = Scores.openDB();

    let db: IDBDatabase;
    let store: IDBObjectStore;
    let index: IDBIndex;
    let transaction: IDBTransaction;

    request.onsuccess = () => {
      db = request.result;
      transaction = db.transaction(storeName, "readwrite");
      store = transaction.objectStore(storeName);
      index = store.index("totalTime");

      let timeStr = numberToTime(time);

      store.put({
        totalTime: timeStr,
      });

      transaction.oncomplete = () => {
        db.close();
      };
    };
  };

  static getTimes = (questions: Question[]): string[] => {
    let times = new Array<string>(questions.length);
    let i = 0;
    questions.forEach((q) => {
      times[i] = q.getTime().toString();
      i++;
    });
    return times;
  };

  static getPenalties = (
    questions: Question[],
    answers: AnswerContainer
  ): string[] => {
    let penalties = new Array<string>(questions.length);
    let i = 0;
    questions.forEach((q) => {
      penalties[i] = q.checkAnswer(answers.getAnswer(q.questionId)).toString();
      i++;
    });
    return penalties;
  };

  static addQuizScoreDetailed(
    questions: Question[],
    answers: AnswerContainer,
    time: number
  ) {
    const request = Scores.openDB();

    let db: IDBDatabase;
    let store: IDBObjectStore;
    let index: IDBIndex;
    let transaction: IDBTransaction;

    request.onsuccess = () => {
      db = request.result;
      transaction = db.transaction(storeName, "readwrite");
      store = transaction.objectStore(storeName);
      index = store.index("totalTime");

      let timeStr = numberToTime(time);

      let userAnswersTimes = Scores.getTimes(questions);

      let userPenalties = Scores.getPenalties(questions, answers);

      store.put({
        totalTime: timeStr,
        questionsTimes: userAnswersTimes,
        correctness: userPenalties,
      });

      transaction.oncomplete = () => {
        db.close();
      };
    };
  }

  static extractScores(fun, rendered: (HTMLElement) => void) {
    const request = Scores.openDB();
    let db: IDBDatabase;
    let store: IDBObjectStore;
    let index: IDBIndex;
    let transaction: IDBTransaction;

    request.onsuccess = () => {
      db = request.result;
      transaction = db.transaction(storeName, "readwrite");
      store = transaction.objectStore(storeName);
      index = store.index("totalTime");

      const getAllRequest: IDBRequest<any[]> = index.getAll();

      getAllRequest.onsuccess = () => {
        let res: ScoresRecord[] = getAllRequest.result;
        let times = Array(res.length);
        let i = 0;
        res.forEach((record) => {
          times[i] = record.totalTime;
          i++;
        });

        console.log(times);

        fun(times, rendered);
      };
    };
  }
}

export default Scores;
