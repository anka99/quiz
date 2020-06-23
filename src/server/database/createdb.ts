import * as sqlite from "sqlite3";
import { encrypt, openDatabase } from "../utils";
import { addQuiz } from "../quiz";
import template from "../../templates/ExampleTemplate";

sqlite.verbose();

const createUsersTable = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='users';`,
      (selectErr, rows) => {
        if (selectErr) {
          reject(selectErr);
          return;
        }

        if (rows[0].cnt === 1) {
          console.log("Users already exist.");
          resolve();
          return;
        }
        db.run(
          `CREATE TABLE users (
                    username TEXT,
                    password TEXT,
                    PRIMARY KEY(username)
                    );`,
          [],
          (err) => {
            if (err) {
              reject(err.message);
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};

const createQuizTable = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='quiz';`,
      (selectErr, rows) => {
        if (selectErr) {
          reject(selectErr);
          return;
        }

        if (rows[0].cnt === 1) {
          console.log("Quiz already exist.");
          resolve();
          return;
        }
        db.run(
          `CREATE TABLE quiz (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description TEXT
                    );`,
          [],
          (err) => {
            if (err) {
              reject(err.message);
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};

const createQuestionsTable = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='questions';`,
      (selectErr, rows) => {
        if (selectErr) {
          reject(selectErr);
          return;
        }

        if (rows[0].cnt === 1) {
          console.log("Questions already exist.");
          resolve();
          return;
        }
        db.run(
          `CREATE TABLE questions (
                    quiz NUMBER,
                    id NUMBER,
                    task TEXT,
                    answer TEXT,
                    penalty NUMBER,
                    PRIMARY KEY(quiz, id)
                    );`,
          [],
          (err) => {
            if (err) {
              reject("DB Error");
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};

const createAnswersTable = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='answers';`,
      (selectErr, rows) => {
        if (selectErr) {
          reject(selectErr);
          return;
        }

        if (rows[0].cnt === 1) {
          console.log("Answers already exist.");
          resolve();
          return;
        }
        db.run(
          `CREATE TABLE answers (
                    username TEXT,
                    quiz NUMBER,
                    question NUMBER,
                    time NUMBER,
                    answer TEXT,
                    PRIMARY KEY(username, quiz, question),
                    FOREIGN KEY(quiz, question) REFERENCES questions(quiz, id)
                    );`,
          [],
          (err) => {
            if (err) {
              reject(err.message);
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};

const addUser = (
  db: sqlite.Database,
  username: string,
  password: string
): Promise<void> => {
  const encrypted: string = encrypt(username, password);
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password) VALUES ('${escape(
        username
      )}', '${encrypted}');`,
      (err) => {
        if (err) {
          reject(err.message);
          return;
        }
        resolve();
      }
    );
  });
};

const database = openDatabase();

createUsersTable(database)
  .then(() => {
    addUser(database, "admin", "admin");
    addUser(database, "user1", "user1");
    addUser(database, "user2", "user2")
      .then(() => {
        createQuizTable(database)
          .then(() => {
            createQuestionsTable(database)
              .then(() => {
                createAnswersTable(database)
                  .then(() => {
                    database.close();
                    addQuiz(template)
                      .then(() => {
                        addQuiz(template).catch((err) => {
                          console.log(err.message);
                        });
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  })
                  .catch((err) => {
                    console.log(err.message);
                  })
                  .catch((message) => {
                    console.log(message);
                  });
              })
              .catch((message) => {
                console.log(message);
              });
          })
          .catch((message) => {
            console.log(message);
          });
      })
      .catch((message) => {
        console.log(message);
      });
  })
  .catch((err) => {
    console.log(err.message);
  });
