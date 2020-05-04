import State from "./State";
import { numberToTime } from "../tools/timeTools.js";

class Timer {
  private element: HTMLElement;
  private time: number;
  private interval: number;

  constructor(className: string) {
    this.time = 0;
    this.interval = null;
    this.element = document.createElement("div");
    this.element.setAttribute("class", className);
    let timerText = document.createElement("h2");
    timerText.setAttribute("id", "timer");
    timerText.innerText = "00:00:00";
    this.element.appendChild(timerText);
  }

  public get seconds(): number {
    return this.time;
  }

  update = () => {
    let timerText: HTMLHeadingElement = this.element.querySelector("#timer");
    timerText.innerText = numberToTime(this.time);
  };

  start = () => {
    if (!this.interval) {
      this.interval = window.setInterval(() => {
        this.time++;
        this.update();
      }, 1000);
    }
  };

  stop = () => {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
    console.log(this.time);
  };

  reset = () => {
    this.stop;
    this.time = 0;
    this.update();
  };

  render() {
    return this.element;
  }
}

export default Timer;
