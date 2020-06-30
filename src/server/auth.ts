import { openDatabase, encrypt } from "./utils";
import * as sqlite from "sqlite3";

export const verifyUser = (
  username: string,
  password: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all(
      `SELECT password
        FROM users
        WHERE username = ?;`,
      [username],
      (err, rows) => {
        if (err) {
          reject(err.message);
          return;
        }
        db.close();
        if (rows === null || rows.length === 0) {
          resolve(false);
          return;
        }
        if (
          encrypt(username, password).localeCompare(rows[0]?.password) === 0
        ) {
          resolve(true);
          return;
        }
        resolve(false);
      }
    );
  });
};

export const logout = (username: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database("sessions");
    db.run(
      `DELETE FROM sessions WHERE sess LIKE '%"user":"' || ? || '"%'`,
      [username],
      (err) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

export const changePassword = (
  username: string,
  password: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.run(
      `UPDATE users SET password=? WHERE username=?;`,
      [encrypt(username, password), username],
      (err) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};
