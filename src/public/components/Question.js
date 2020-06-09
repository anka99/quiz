import Timer from "./Timer.js";
class Question {
    constructor(template, answerContainer, id) {
        this.stopTimer = () => {
            this.timer.stop();
        };
        this.startTimer = () => {
            this.timer.start();
        };
        this.resetTimer = () => {
            this.timer.reset();
        };
        this.getTime = () => {
            return this.timer.seconds;
        };
        this.getPenalty = () => {
            return this.penalty;
        };
        this.getContet = () => {
            return this.question;
        };
        this.checkAnswer = (answer) => {
            if (answer === this.correctAswer) {
                return 0;
            }
            return this.penalty;
        };
        this.render = () => {
            let questionContainer = document.createElement("div");
            questionContainer.className = "question-container";
            let questionText = document.createElement("h2");
            questionText.className = "question-text";
            questionText.textContent =
                this.question +
                    " = ? Time penalty for incorrect answer is " +
                    this.penalty +
                    " seconds";
            let questionInput = document.createElement("input");
            questionInput.type = "text";
            questionInput.setAttribute("class", "input");
            questionInput.addEventListener("input", this.answerContainer.actualizeAswer(this.id));
            questionContainer.appendChild(questionText);
            questionContainer.appendChild(questionInput);
            return questionContainer;
        };
        this.question = template.question;
        this.correctAswer = template.answer;
        this.penalty = template.penalty;
        this.id = id;
        this.answerContainer = answerContainer;
        this.timer = new Timer("question-timer-place");
    }
    get correctAnswer() {
        return this.correctAnswer;
    }
    get questionId() {
        return this.id;
    }
}
export default Question;
//# sourceMappingURL=Question.js.map