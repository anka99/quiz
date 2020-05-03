import { numberToTime } from "../tools/timeTools.js";

class Scores {
  static addScore(time: number) {
    let item = localStorage.getItem("scores");
    console.log(item);
    if (item === null) {
      item = numberToTime(time);
    } else {
      item = item + "," + numberToTime(time);
    }
    localStorage.setItem("scores", item);
  }

  private static getScores(): string[] {
    let scores = localStorage.getItem("scores");
    if (!scores) {
      return null;
    }
    return scores.split(",");
  }

  static render() {
    let element = document.createElement("div");
    element.setAttribute("class", "scores");
    let scores = this.getScores();
    if (scores !== null) {
      scores.forEach((score) => {
        let scoreElement = document.createElement("div");
        scoreElement.setAttribute("class", "score");
        let scoreText = document.createElement("h1");
        scoreText.innerText = "Time: " + score;
        scoreElement.appendChild(scoreText);
        element.appendChild(scoreElement);
      });
    }

    return element;
  }
}

export default Scores;
