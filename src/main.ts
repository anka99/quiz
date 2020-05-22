import Quiz from "./components/Quiz.js";
import { template } from "./templates/ExampleTemplate.js";

let quiz = new Quiz(template);

quiz.tryFetchToken();
quiz.putToken();

// localStorage.removeItem("scores");

// console.log(template);

quiz.render();
