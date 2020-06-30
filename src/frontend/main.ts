import Quiz from "./components/Quiz.js";

fetch(`/quiz`)
  .then((rawData) => {
    const csrfToken = rawData.headers.get("CSRF-Header");
    rawData
      .json()
      .then((data) => {
        console.log(data);
        console.log(csrfToken);
        const quiz = new Quiz(data, csrfToken);
        quiz.render();
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
