import { QuizTemplate } from "../templates/QuizTemplate";
import * as sqlite from "sqlite3";
import { openDatabase, standardCatch } from "./utils";
import { QuestionTemplate } from "../templates/QuestionTemplate";
import IdQuiz from "./IdQuiz";

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
          return addQuestions(db, quizId, questions, questionsLeft - 1);
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

export const addQuiz = (quiz: QuizTemplate) => {
  const db = openDatabase();
  console.log("adding quiz");
  addDescription(db, quiz.introduction)
    .then(() => {
      getId(db)
        .then((quizId) => {
          addQuestions(db, quizId, quiz.questions, quiz.questions.length)
            .then(() => {
              db.close();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getQuestions = (quizId: number): Promise<QuestionTemplate[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(`SELECT * FROM questions WHERE quiz = ${quizId};`, (err, rows) => {
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
    }).close();
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

export const getDescr = (): Promise<IdQuiz[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(`SELECT * FROM quiz;`, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const quizzes = new Array<IdQuiz>();
      rows.forEach((row) => {
        const quiz = new IdQuiz(row.id, row.description);
        quizzes.push(quiz);
      });
      resolve(quizzes);
    }).close();
  });
};

export const getQuizDescr = (quizId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.get(`SELECT * from quiz WHERE id = ${quizId};`, (err, row) => {
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
