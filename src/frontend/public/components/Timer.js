import { numberToTime } from "../tools/timeTools.js";
class Timer {
    constructor(className) {
        this.update = () => {
            let timerText = this.element.querySelector("#timer");
            timerText.innerText = numberToTime(this.time);
        };
        this.start = () => {
            if (!this.interval) {
                this.interval = window.setInterval(() => {
                    this.time++;
                    this.update();
                }, 1000);
            }
        };
        this.stop = () => {
            if (this.interval) {
                window.clearInterval(this.interval);
                this.interval = null;
            }
        };
        this.reset = () => {
            this.stop;
            this.time = 0;
            this.update();
        };
        this.time = 0;
        this.interval = null;
        this.element = document.createElement("div");
        this.element.setAttribute("class", className);
        let timerText = document.createElement("h2");
        timerText.setAttribute("id", "timer");
        timerText.innerText = "00:00:00";
        this.element.appendChild(timerText);
    }
    get seconds() {
        return this.time;
    }
    render() {
        return this.element;
    }
}
export default Timer;
//# sourceMappingURL=Timer.js.map