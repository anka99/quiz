import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { verifyUser } from "./auth";
import csurf from "csurf";
import path from "path";
import { addQuiz, getDescr, getQuestionsSafe, getQuizDescr } from "./quiz";
import { standardCatch } from "./utils";
import { QuizTemplate } from "../templates/QuizTemplate";
import bodyParser from "body-parser";
import template from "../templates/ExampleTemplate";
import { addScore, getAnswers, verifyScore } from "./score";

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

console.log(__dirname);

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

addQuiz(template);
addQuiz(template);

app.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    res.sendFile("public/quiz.html", {
      root: ".",
    });
  }
});

app.get("/home", (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect("/login");
  } else {
    let quizzes;
    getDescr()
      .then((q) => {
        quizzes = q;
        res.render("home", {
          quizzes: quizzes,
          username: req.session?.user,
        });
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

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/login", (req, res) => {
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
    console.log(quizId);
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
  console.log(req.body);
  const time = (Date.now() - req.session.timeStart) / 1000;
  addScore(req.body, req.session.user, req.body.id, time)
    .then(() => {
      console.log("score added");
      req.session.timeStart = null;
      req.session.quiz = null;
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
    getAnswers(req.body.quizId, req.session.user).then((answers) => {
      verifyScore(answers, req.body.quizId).then((score) => {
        console.log(score);
      })
    res.redirect("/history/" + req.body.quizId);
  }
});
// app.post("/submit", (req, res, next) => {});

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

export default app;
