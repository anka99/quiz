class AnswerContainer {
    constructor(length) {
        this.actualizeAswer = (i) => (ev) => {
            let strAnswer = ev.target.value.trim();
            if (this.validAnswer(strAnswer)) {
                if (this.answers[i] === "empty") {
                    this.filled++;
                }
                this.answers[i] = strAnswer;
            }
            else {
                if (this.answers[i] !== "empty") {
                    this.filled--;
                }
                this.answers[i] = "empty";
            }
            this.render();
        };
        this.answers = new Array(length);
        for (let i = 0; i < this.answers.length; i++) {
            this.answers[i] = "empty";
        }
        this.filled = 0;
    }
    getAnswer(i) {
        return this.answers[i];
    }
    validAnswer(answer) {
        if (answer.length < 1 || answer === "-") {
            return false;
        }
        let regex = new RegExp("^(-?)[0-9]*$");
        return regex.test(answer);
    }
    clear() {
        this.answers = new Array(this.answers.length);
        for (let i = 0; i < this.answers.length; i++) {
            this.answers[i] = "empty";
        }
        this.filled = 0;
    }
    renderBar() {
        let bar = document.createElement("div");
        bar.setAttribute("class", "answer-bar");
        let barItems = new Array(length);
        let i = 0;
        this.answers.forEach((a) => {
            i++;
            let el = document.createElement("div");
            let num = document.createElement("h2");
            num.innerText = i.toString();
            if (this.answers[i - 1] == "empty") {
                el.setAttribute("class", "bar-item");
            }
            else {
                el.setAttribute("class", "bar-item-empty");
            }
            el.appendChild(num);
            bar.appendChild(el);
        });
        return bar;
    }
    renderPreviousAnswer(i) {
        let el = document.createElement("div");
        if (this.answers[i] != "empty") {
            el.setAttribute("class", "prev-ans");
            let text = document.createElement("h2");
            text.innerText = "Your answer:\n" + this.answers[i];
            el.appendChild(text);
        }
        return el;
    }
    render() {
        let finishButton = document.getElementById("finish");
        if (finishButton) {
            if (this.filled == this.answers.length) {
                finishButton.removeAttribute("disabled");
            }
            else {
                finishButton.setAttribute("disabled", "yes");
            }
        }
    }
}
export default AnswerContainer;
//# sourceMappingURL=AnswerContainer.js.map