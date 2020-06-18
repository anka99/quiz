import { QuizTemplate } from "../templates/QuizTemplate";
import * as sqlite from "sqlite3";
import { openDatabase } from "./utils";
import { QuestionTemplate } from "../templates/QuestionTemplate";
import IdQuiz from "./IdQuiz";

const getId = (db): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT MAX(id) as quizId FROM quiz;`, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(row.quizId);
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
      console.log("adding question " + questionsLeft);
      const question = questions[questionsLeft - 1];
      addQuestion(
        db,
        quizId,
        questionsLeft,
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
      console.log("resolving");
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

const qetQuestions = (quizId: number): Promise<QuestionTemplate[]> =>  {

}

export const getQuizzes = (): Promise<QuizTemplate[]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(`SELECT * FROM quiz;`, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const quizzes = new Array<QuizTemplate>();
      rows.forEach(row => {
        const quiz = new IdQuiz(row.)
      });
    });
  });
};
