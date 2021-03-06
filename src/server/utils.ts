import * as sqlite from "sqlite3";
import sha256 from "sha256";

export const openDatabase = () => {
  return new sqlite.Database("quiz.db");
};

export const encrypt = (username: string, password: string): string => {
  return sha256(username + password, { asString: true });
};

export const closeDatabase = (db: sqlite.Database) => {
  db.close();
};

export const beginTransaction = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(`BEGIN TRANSACTION;`, (err) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

export const commit = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(`COMMIT;`, (err) => {
      db.close();
      if (err) {
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

export const commitFun = (db: sqlite.Database) => () => {
  commit(db).catch((message) => {
    console.log(message);
  });
};

export const rollback = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close();
    db.run(`ROLLBACK;`, (err) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

export const rollbackFun = (db: sqlite.Database) => () => {
  rollback(db).catch((message) => {
    console.log(message);
  });
};

export const standardCatch = (err) => {
  console.log(err.message);
};
