import State from "./State";
import { numberToTime } from "../tools/timeTools.js";

class Timer {
  private element: HTMLElement;
  private state: State;

  constructor(state: State) {
    this.element = document.createElement("div");
    this.element.setAttribute("class", "timer-place");
    let timerText = document.createElement("h2");
    timerText.setAttribute("id", "timer");
    timerText.innerText = "00:00";

    this.element.appendChild(timerText);
    this.state = state;
  }

  public get seconds(): number {
    return this.state.time;
  }

  update = () => {
    let timerText: HTMLHeadingElement = this.element.querySelector("#timer");
    timerText.innerText = numberToTime(this.state.time);
  };

  start = () => {
    if (!this.state.interval) {
      this.state.interval = window.setInterval(() => {
        this.state.time++;
        this.update();
      }, 1000);
    }
  };

  stop = () => {
    if (this.state.interval) {
      window.clearInterval(this.state.interval);
      this.state.interval = null;
    }
    console.log(this.state.time);
  };

  reset = () => {
    this.stop;
    this.state.time = 0;
    this.update();
  };

  render() {
    return this.element;
  }
}

export default Timer;
