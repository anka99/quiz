import { numberToTime } from "../tools/timeTools.js";

class FinishedWindow {
  static render(time: number) {
    let el = document.createElement("div");
    let text = document.createElement("p");
    text.textContent = "congratulations 2/10 your time " + numberToTime(time);
    el.appendChild(text);
    return el;
  }
}

export default FinishedWindow;
