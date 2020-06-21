import Quiz from "./components/Quiz.js";

fetch("/quiz", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((rawData) => rawData.json())
  .then((data) => {
    console.log(data);
    const quiz = new Quiz(data);
    quiz.render();
  })
  .catch((err) => {
    console.log(err);
  });
