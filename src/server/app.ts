import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { verifyUser, logout } from "./auth";
import csurf from "csurf";
import path from "path";
import {
  getDescr,
  getQuestionsSafe,
  getQuizDescr,
  quizzesDone,
  addQuiz,
} from "./quiz";
import { standardCatch } from "./utils";
import { QuizTemplate } from "../templates/QuizTemplate";
import bodyParser from "body-parser";
import template from "../templates/ExampleTemplate";
import { addScore, getAnswers, verifyScore, getQuizesDone } from "./score";
import { getAverage } from "./stats";

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

// addQuiz(template);
// addQuiz(template);
// addQuiz(template);

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

app.get("/home", (req, res) => {
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
            });
          }
        );
      })
      .catch(standardCatch);
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

app.post("/login", csrfProtection, (req, res) => {
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
        console.log(message);
      });
  }
});

app.post("/quiz/:quizId", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    req.session.quiz = req.body.quizId;
    // console.log(req.session.quiz);
    res.redirect("/");
  }
});

app.get("/quiz", async (req, res, next) => {
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
            res.status(200).json(quiz);
          })
          .catch((message) => {
            console.log(message);
            res.status(501);
            // create error
          });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(502);
        // create error
      });
  }
});

app.use(bodyParser.json());

app.post("/answers", (req, res) => {
  const time = (Date.now() - req.session.timeStart) / 1000;
  addScore(req.body, req.session.user, req.body.id, time)
    .then(() => {
      req.session.timeStart = null;
      const quiz = req.session.quiz;
      req.session.quiz = null;
      res.redirect("/history/" + quiz);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/history/:quizId", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    // console.log(req.session.quiz);
    res.redirect("/history/" + req.body.quizId);
  }
});

app.get("/history/:quizId", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    getAnswers(+req.params.quizId, req.session.user)
      .then((answers) => {
        verifyScore(answers, +req.params.quizId)
          .then((score) => {
            getAverage(+req.params.quizId)
              .then((averages) => {
                res.render("quiz_history", {
                  quiz: score.quiz,
                  score: score.score,
                  user_answers: score.user_answers,
                  username: req.session.user,
                  averages: averages,
                });
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
  }
});

app.get("/history/", (req, res) => {
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
