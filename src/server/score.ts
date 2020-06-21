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
import { getQuestionsSafe, getQuestions, getQuizDescr } from "./quiz";
import { UserScore } from "../templates/UserScore";
import { rejects } from "assert";

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
  quizId: number
): Promise<UserScore> => {
  return new Promise((resolve, reject) => {
    const questionsInfo = new Array<QuestionTemplate>();
    let score = answers.times.reduce((prev, curr, index, arr) => {
      return prev + curr;
    });
    let quiz: QuizTemplate;
    getQuestions(quizId)
      .then((questions) => {
        let i = 0;
        questions.forEach((q) => {
          const qInfo: QuestionTemplate = {
            id: i,
            question: q.question,
            answer: q.answer,
            penalty: answers.answers[i] === q.answer ? 0 : q.penalty,
          };
          score += answers.answers[i] === q.answer ? 0 : q.penalty;
          questionsInfo.push(qInfo);
          i++;
        });
        getQuizDescr(quizId)
          .then((descr) => {
            quiz = {
              id: quizId,
              introduction: descr,
              questions: questionsInfo,
            };
            resolve({
              quiz: quiz,
              score: score,
              user_answers: answers.answers,
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const getAnswers = (
  quizId: number,
  username: string
): Promise<UserAnswers> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT * FROM answers
         WHERE username = ? AND quiz = ${quizId}
         ORDER BY question;`,
      [username],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const answers = {
          id: quizId,
          times: new Array(),
          ids: new Array(),
          answers: new Array(),
        };
        rows.forEach((row) => {
          answers.times.push(row.time);
          answers.ids.push(row.question);
          answers.answers.push(row.answer);
        });
        resolve(answers);
      }
    );
  });
};

export const getQuizesDone = (
  username: string
): Promise<[number, string][]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT quiz, description
    FROM
    answers JOIN quiz
    ON answers.quiz = quiz.id
    WHERE username = ?
    GROUP BY quiz
    ORDER BY quiz;`,
      [username],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
};
