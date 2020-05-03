import { numberToTime } from "../tools/timeTools.js";
import Scores from "./Scores.js";

class FinishedWindow {
  static render(time: number) {
    Scores.addScore(time);
    let el = document.createElement("div");
    el.setAttribute("class", "loooser");
    let text = document.createElement("h1");
    text.textContent = "yout time: " + numberToTime(time);
    el.appendChild(text);
    return el;
  }
}

export default FinishedWindow;
