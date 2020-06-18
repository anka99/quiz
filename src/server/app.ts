import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { verifyUser } from "./auth";
import * as sqlite from "sqlite3";
import csurf from "csurf";
import path from "path";
import { addQuiz } from "./quiz";
import { template } from "./templates/ExampleTemplate";

// tslint:disable-next-line: no-var-requires
const connectSqlite = require("connect-sqlite3");

const sqliteStore = connectSqlite(session);

const app = express();

const csrfProtection = csurf({ cookie: true });

const secretValue = "Duchowe zycie zwierzat.";

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

app.get("/", (req, res) => {
  if (req.session?.user === null) {
    res.redirect("/login");
  } else {
    res.sendFile("public/quiz.html", {
      root: ".",
    });
  }
});

app.get("/home", (req, res) => {
  if (req.session?.user === null) {
    res.redirect("/login");
  }
});

app.get("/login", csrfProtection, (req, res, next) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post("/login", csrfProtection, (req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  verifyUser(username, password)
    .then((correct: boolean) => {
      if (correct) {
        req.session.user = username;
        res.redirect("/");
      } else {
        console.log("Inorrect credentials");
      }
    })
    .catch((message) => {
      console.log(message);
    });
});

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
