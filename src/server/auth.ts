import { openDatabase, encrypt } from "./utils";

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
        if (rows === null || rows.length === 0) {
          resolve(false);
        }
        if (
          encrypt(username, password).localeCompare(rows[0]?.password) === 0
        ) {
          resolve(true);
        }
        resolve(false);
      }
    );
  });
};
