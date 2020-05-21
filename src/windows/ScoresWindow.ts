import Scores, { timeSpliterator } from "../components/Scores.js";

class ScoresWindow {
  private static renderScoreText(text: string): HTMLElement {
    let quizScores = text.split(timeSpliterator);
    let textEl = document.createElement("h2");
    textEl.textContent = quizScores[0];
    return textEl;
  }
  static render = (): HTMLElement => {
    let window = document.createElement("div");
    window.setAttribute("class", "prev-scores");
    let prevScoresText = document.createElement("h1");
    prevScoresText.textContent = "Previous times";
    window.appendChild(prevScoresText);
    let scores = Scores.getScores();
    if (scores === null) {
      return window;
    }

    scores.forEach((score) => {
      let textEl = ScoresWindow.renderScoreText(score);
      window.append(textEl);
    });
    return window;
  };
}

export default ScoresWindow;
