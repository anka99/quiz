import Scores from "../components/Scores.js";

class ScoresWindow {
  private static renderScoreText(text: string): HTMLElement {
    let textEl = document.createElement("h2");
    textEl.textContent = text;
    return textEl;
  }
  static render = (
    scores: string[],
    rendered: (HTMLElement) => void
  ): HTMLElement => {
    let window = document.createElement("div");
    window.setAttribute("class", "prev-scores");
    let prevScoresText = document.createElement("h1");
    prevScoresText.textContent = "Previous times";
    window.appendChild(prevScoresText);

    if (scores === null) {
      return window;
    }

    scores.forEach((score) => {
      let textEl = ScoresWindow.renderScoreText(score);
      window.append(textEl);
    });

    rendered(window);
  };
}

export default ScoresWindow;
