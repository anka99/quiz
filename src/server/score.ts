import { UserAnswers } from "../templates/UserAnswers";
import {
  openDatabase,
  beginTransaction,
  rollbackFun,
  commitFun,
  rollback,
  commit,
} from "./utils";
import * as sqlite from "sqlite3";
import { QuestionTemplate } from "../templates/QuestionTemplate";
import { QuizTemplate } from "../templates/QuizTemplate";
import { getQuestionsSafe, getQuestions } from "./quiz";

const addAnswer = (
  db: sqlite.Database,
  username: string,
  quiz: number,
  question: number,
  time: number,
  answer: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = `INSERT INTO answers (username, quiz, question, time, answer)
        VALUES (?, ?, ?, ?, ?);`;
    db.run(req, [username, quiz, question, time, answer], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const addAnswers = (
  db: sqlite.Database,
  answers: UserAnswers,
  username: string,
  quizId: number,
  answersLeft: number
) => {
  return new Promise((resolve, reject) => {
    if (answersLeft > 0) {
      const i = answersLeft - 1;
      addAnswer(
        db,
        username,
        quizId,
        answers.ids[i],
        answers.times[i],
        answers.answers[i]
      )
        .then(() => {
          addAnswers(db, answers, username, quizId, i)
            .then(resolve)
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      console.log("answers added");
      resolve();
    }
  });
};

export const addScore = (
  answers: UserAnswers,
  username: string,
  quizId: number,
  time: number
): Promise<void> => {
  for (let i = 0; i < answers.times.length; i++) {
    answers.times[i] = Math.ceil((answers.times[i] * time) / 100);
  }
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    beginTransaction(db)
      .then(() => {
        addAnswers(db, answers, username, quizId, answers.answers.length)
          .then(() => {
            commit(db);
            resolve();
          })
          .catch((err) => {
            rollback(db);
            reject(err.message);
          });
      })
      .catch((message) => {
        reject(message);
      });
  });
};

export const verifyScore = (
  answers: UserAnswers,
  username: string,
  quizId: number
): Promise<QuizTemplate> => {
  return new Promise((resolve, reject) => {
    let questionsInfo = new Array<QuestionTemplate>();
    const score = answers.times.reduce((prev, curr, index, arr) => {
      return prev + curr;
    });
    getQuestions(quizId).then((questions) => {
      let i = 0;
      questions.forEach((q) => {
        let qInfo: QuestionTemplate = {
          id: i,
          question: q.question,
          answer: q.answer,
          penalty: q.penalty,
        };
        questionsInfo.push(qInfo);
        i++;
      });
    });
  });
};
