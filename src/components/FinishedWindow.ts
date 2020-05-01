import { numberToTime } from "../tools/timeTools";

class FinishedWindow {
  static render(time: number) {
    let el = document.createElement("div");
    let text = document.createElement("p");
    text.textContent = "congratulations 2/10 your score is " + time;
    el.appendChild(text);
    return el;
  }
}

export default FinishedWindow;
