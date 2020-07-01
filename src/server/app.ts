import createError from "http-errors";
import express, { request } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { verifyUser, logout, changePassword } from "./auth";
import csurf from "csurf";
import path from "path";
import {
  getDescr,
  getQuestionsSafe,
  getQuizDescr,
  quizzesDone,
  quizDone,
} from "./quiz";
import { QuizTemplate } from "../templates/QuizTemplate";
import bodyParser from "body-parser";
import {
  addScore,
  getAnswers,
  verifyScore,
  getQuizesDone,
  correctAnsLen,
} from "./score";
import { getAverage, getTopFive } from "./stats";

// tslint:disable-next-line: no-var-requires
const connectSqlite = require("connect-sqlite3");

const sqliteStore = connectSqlite(session);

const app = express();

const csrfProtection = csurf({ cookie: true });

const secretValue = "IN GIRUM IMUS NOCTE ET CONSUMIMUR IGNI";

app.set("view engine", "pug");

app.set("port", "3000");

app.use(cookieParser(secretValue));

app.use(
  session({
    secret: secretValue,
    cookie: { maxAge: 15 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
    store: new sqliteStore(),
  })
);

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../")));

app.use(cookieParser(secretValue));

app.use(
  session({
    secret: secretValue,
    cookie: { maxAge: 15 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
    store: new sqliteStore(),
  })
);

app.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else if (!req.session.quiz) {
    res.redirect("/home");
  } else {
    res.sendFile("public/quiz.html", {
      root: ".",
    });
  }
});

app.get("/home", csrfProtection, (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user === undefined) {
    res.redirect("/login");
  } else {
    getDescr()
      .then((quizzes) => {
        const done: boolean[] = new Array();
        quizzesDone(req.session.user, quizzes, done, quizzes.length).then(
          () => {
            res.render("home", {
              quizzes: quizzes,
              username: req.session.user,
              done: done,
              csrfToken: req.csrfToken(),
            });
          }
        );
      })
      .catch(() => {
        next(createError(404));
      });
  }
});

app.post("/logout", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    req.session.user = null;
    res.redirect("/login");
  }
});

app.get("/login", csrfProtection, (req, res, next) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post("/login", csrfProtection, (req, res, next) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  if (username && password) {
    verifyUser(username, password)
      .then((correct: boolean) => {
        if (correct) {
          req.session.user = username;
          res.redirect("/home");
        } else {
          console.log("Incorrect credentials");
        }
      })
      .catch((message) => {
        next(createError(404));
      });
  }
});

app.post("/quiz/:quizId", csrfProtection, (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    req.session.quiz = req.body.quizId;
    res.redirect("/");
  }
});

app.get("/quiz", csrfProtection, async (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    const quizId = req.session.quiz;
    getQuestionsSafe(quizId)
      .then((questions) => {
        getQuizDescr(quizId)
          .then((description) => {
            const quiz: QuizTemplate = {
              id: quizId,
              introduction: description,
              questions: questions,
            };
            req.session.timeStart = Date.now();
            req.session.quizLen = questions.length;
            res.setHeader("CSRF-Header", req.csrfToken());
            res.status(200).json(quiz);
          })
          .catch((message) => {
            console.log(message);
            res.status(501);
            next(createError(404));
          });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(502);
        next(createError(404));
      });
  }
});

app.use(bodyParser.json());

app.post("/answers", csrfProtection, (req, res, next) => {
  const time = (Date.now() - req.session.timeStart) / 1000;
  if (
    !correctAnsLen(req.body, req.session.quizLen) ||
    !req.session.user ||
    !req.session.quiz ||
    req.session.quiz !== req.body.id
  ) {
    next(createError(404));
  } else {
    addScore(req.body, req.session.user, req.body.id, time)
      .then(() => {
        req.session.timeStart = null;
        const quiz = req.session.quiz;
        req.session.quiz = null;
        res.redirect("/history/" + quiz);
      })
      .catch((err) => {
        console.log(err.message);
        next(createError(404));
      });
  }
});

app.post("/history/:quizId", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    res.redirect("/history/" + req.body.quizId);
  }
});

app.get("/history/:quizId", (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    getAnswers(+req.params.quizId, req.session.user)
      .then((answers) => {
        verifyScore(answers, +req.params.quizId)
          .then((score) => {
            getAverage(+req.params.quizId)
              .then((averages) => {
                getTopFive(+req.params.quizId)
                  .then((top) => {
                    res.render("quiz_history", {
                      quiz: score.quiz,
                      score: score.score,
                      user_answers: score.user_answers,
                      username: req.session.user,
                      averages: averages,
                      top: top,
                    });
                  })
                  .catch((err) => {
                    next(createError(404));
                  });
              })
              .catch((err) => {
                console.log(err);
                next(createError(404));
              });
          })
          .catch((err) => {
            console.log(err);
            next(createError(404));
          });
      })
      .catch((err) => {
        console.log(err);
        next(createError(404));
      });
  }
});

app.get("/history/", (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    getQuizesDone(req.session.user)
      .then((quizzes) => {
        res.render("history", {
          quizzes: quizzes,
          username: req.session?.user,
        });
      })
      .catch((err) => {
        console.log(err);
        next(createError(404));
      });
  }
});

app.post("/logout", (req, res) => {
  if (req.session?.user) {
    logout(req.session.user);
  }
  res.redirect("/login");
});

app.post("/giveup", (req, res) => {
  if (req.session?.user) {
    req.session.timeStart = null;
    req.session.quiz = null;
    res.redirect("/home");
  }
});

app.post("/changepassword", csrfProtection, (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    const old_password: string = req.body.old_password;
    const new_password: string = req.body.new_password;
    const username = req.session.user;
    verifyUser(username, old_password)
      .then((correct) => {
        if (!correct) {
          console.log("Incorrect credentials");
          next();
        } else {
          changePassword(username, new_password)
            .then(() => {
              logout(username);
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              next(createError(404));
            });
        }
      })
      .catch((err) => {
        console.log(err);
        next(createError(404));
      });
  }
});

app.get("/changepassword", csrfProtection, (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    res.render("change_password", { csrfToken: req.csrfToken() });
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
