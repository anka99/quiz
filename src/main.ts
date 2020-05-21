import Quiz from "./components/Quiz.js";
import { template } from "./templates/ExampleTemplate.js";

let quiz = new Quiz(template);

// localStorage.removeItem("scores");

// console.log(template);

quiz.render();
