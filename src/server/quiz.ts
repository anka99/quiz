import { QuizTemplate } from "../templates/QuizTemplate";
import * as sqlite from "sqlite3";
import { openDatabase } from "./utils";
import { QuestionTemplate } from "../templates/QuestionTemplate";

const getId = (db): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT MAX(id) as quizId FROM quiz;`, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.quizId);
    });
  });
};

const addDescription = (
  db: sqlite.Database,
  description: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO quiz (description) VALUES (?);`,
      [description],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

const addQuestion = (
  db: sqlite.Database,
  quizId: number,
  questionId: number,
  task: string,
  answer: string,
  penalty: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO questions (quiz, id, task, answer, penalty)
            VALUES (?, ?, ?, ?, ?)`,
      [quizId, questionId, task, answer, penalty],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

const addQuestions = (
  db: sqlite.Database,
  quizId: number,
  questions: QuestionTemplate[],
  questionsLeft: number
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (questionsLeft > 0) {
      const question = questions[questionsLeft - 1];
      addQuestion(
        db,
        quizId,
        questionsLeft - 1,
        question.question,
        question.answer,
        question.penalty
      )
        .then(() => {
          addQuestions(db, quizId, questions, questionsLeft - 1)
            .then(resolve)
            .catch(reject);
        })
        .catch((err) => {
          console.log(err.message);
          reject();
          return;
        });
    } else {
      resolve();
    }
  });
};

export const addQuiz = (quiz: QuizTemplate): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    addDescription(db, quiz.introduction)
      .then(() => {
        getId(db)
          .then((quizId) => {
            addQuestions(db, quizId, quiz.questions, quiz.questions.length)
              .then(() => {
                db.close();
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getQuestions = (quizId: number): Promise<QuestionTemplate[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT * FROM questions WHERE quiz = ${quizId} ORDER BY id;`,
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        const questions = new Array<QuestionTemplate>();
        rows.forEach((row) => {
          questions.push({
            id: row.id,
            question: row.task,
            answer: row.answer,
            penalty: row.penalty,
          });
        });
        resolve(questions);
      }
    );
  });
};

export const getQuestionsSafe = (
  quizId: number
): Promise<QuestionTemplate[]> => {
  return new Promise((resolve, reject) => {
    getQuestions(quizId)
      .then((questions) => {
        questions.forEach((q) => {
          q.answer = "?";
        });
        resolve(questions);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDescr = (): Promise<Object[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(`SELECT * FROM quiz;`, (err, rows) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

export const getQuizDescr = (quizId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.get(`SELECT * from quiz WHERE id = ${quizId};`, (err, row) => {
      db.close();
      if (err) {
        reject(err.message);
        return;
      }
      if (!row) {
        reject("Invalid quiz id");
        return;
      }
      resolve(row.description);
    });
  });
};

export const getQuizesNotDone = (username: string): Promise<Object[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT quiz.id as id, description
    FROM
    answers JOIN quiz
    ON answers.quiz = quiz.id
    WHERE (username, quiz) NOT IN (SELECT username, quiz FROM answers) as a
    GROUP BY quiz
    ORDER BY quiz;`,
      [username],
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
};

export const quizDone = (username: string, quiz: number): Promise<boolean> => {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM ANSWERS WHERE username = ? AND quiz = ${quiz};`,
      [username],
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        if (rows.length > 0) {
          resolve(true);
          return;
        }
        resolve(false);
      }
    );
  });
};

export const quizzesDone = (
  username: string,
  quizzes,
  done: boolean[],
  quizzesLeft: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (quizzesLeft > 0) {
      const quiz = quizzes[quizzesLeft - 1];
      quizDone(username, quiz.id)
        .then((b) => {
          done.unshift(b);
          quizzesDone(username, quizzes, done, quizzesLeft - 1)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    } else {
      resolve();
    }
  });
};
