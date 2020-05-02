import { numberToTime } from "../tools/timeTools.js";

class FinishedWindow {
  static render(time: number) {
    let el = document.createElement("div");
    el.setAttribute("class", "loooser");
    let text = document.createElement("h1");
    text.textContent = "congratulations 2/10 your time " + numberToTime(time);
    el.appendChild(text);
    return el;
  }
}

export default FinishedWindow;
