import { UserScore } from "../templates/UserScore";
import { openDatabase } from "./utils";

export const getTopFive = (quizId: number): Promise<[string, number][]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT username, SUM(time) as time
        FROM answers
        WHERE quiz = ?
        GROUP BY username
        ORDER BY time
        LIMIT 5;`,
      [quizId],
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        const result = new Array();
        rows.forEach((row) => {
          result.push([row.username, row.time]);
        });
        resolve(result);
      }
    );
  });
};

export const getAverage = (quizId: number): Promise<[number][]> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT AVG(time) AS time
        FROM answers
        WHERE quiz=?
        GROUP BY question
        ORDER BY question;`,
      [quizId],
      (err, rows) => {
        db.close();
        if (err) {
          resolve(err);
          return;
        }
        const result = new Array();
        rows.forEach((row) => {
          result.push(row.time);
        });
        resolve(result);
      }
    );
  });
};
