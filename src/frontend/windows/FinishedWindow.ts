import { numberToTime } from "../tools/timeTools.js";
import Scores from "../components/Scores.js";
import Button from "../components/Button.js";
import Question from "../components/Question.js";
import AnswerContainer from "../components/AnswerContainer.js";

class FinishedWindow {
  private saveStatsButton: Button;
  private saveRawButton: Button;
  private questions: Question[];
  private answers: AnswerContainer;
  private time: number;
  private onSave: () => void;

  constructor(
    questions: Question[],
    answers: AnswerContainer,
    time: number,
    onSave: () => void
  ) {
    this.saveStatsButton = new Button(
      "save-stats",
      "save-stats",
      "save with statistics",
      this.saveStats
    );
    this.saveRawButton = new Button(
      "save-raw",
      "save-raw",
      "save raw",
      this.saveRaw
    );
    this.time = time;
    this.answers = answers;
    this.questions = questions;
    this.onSave = onSave;
  }

  saveRaw = (): void => {
    // Scores.addQuizScoreRaw(this.time);
    this.onSave();
  };

  saveStats = (): void => {
    // Scores.addQuizScoreDetailed(this.questions, this.answers, this.time);
    this.onSave();
  };

  private renderRow = (question: Question): HTMLElement => {
    const row = document.createElement("tr");
    row.setAttribute("class", "scores-row");
    const questionNumber = document.createElement("td");
    questionNumber.innerText = (question.questionId + 1).toString();
    const questionText = document.createElement("td");
    questionText.innerText = question.getContet();
    const penalty = document.createElement("td");
    if (question.checkAnswer(this.answers.getAnswer(question.questionId)) > 0) {
      penalty.innerText = "+ " + question.getPenalty().toString() + " seconds";
      row.setAttribute("class", "incorrect");
    } else {
      penalty.innerText = "+ 0 seconds";
    }
    const timeSpent = document.createElement("td");
    timeSpent.innerText = numberToTime(question.getTime());
    row.appendChild(questionNumber);
    row.appendChild(questionText);
    row.appendChild(penalty);
    row.appendChild(timeSpent);
    return row;
  };

  private renderTHead = (): HTMLElement => {
    const headRow = document.createElement("thead");
    headRow.setAttribute("class", "scores-head");
    const tr = document.createElement("tr");
    const questionNumber = document.createElement("th");
    questionNumber.innerText = "number";
    const questionText = document.createElement("td");
    questionText.innerText = "question";
    const penalty = document.createElement("td");
    penalty.innerText = "your penalty";
    const timeSpent = document.createElement("td");
    timeSpent.innerText = "time spent";
    tr.appendChild(questionNumber);
    tr.appendChild(questionText);
    tr.appendChild(penalty);
    tr.appendChild(timeSpent);
    headRow.appendChild(tr);
    return headRow;
  };

  renderSaveRawButton = (): HTMLElement => {
    return this.saveRawButton.render();
  };

  renderSaveStatsButton = (): HTMLElement => {
    return this.saveStatsButton.render();
  };

  render = (): HTMLElement => {
    const scoresWindow = document.createElement("div");
    scoresWindow.setAttribute("class", "scores-window");
    const yourScoreText = document.createElement("h1");
    yourScoreText.textContent = "your time: " + numberToTime(this.time);
    const scoresTable = document.createElement("table");
    scoresTable.setAttribute("class", "scores-table");
    const tableHead = this.renderTHead();
    const tableBody = document.createElement("tbody");

    this.questions.forEach((question) => {
      question.stopTimer();
      tableBody.appendChild(this.renderRow(question));
    });

    scoresWindow.appendChild(yourScoreText);
    scoresTable.appendChild(tableHead);
    scoresTable.appendChild(tableBody);
    scoresWindow.appendChild(scoresTable);
    return scoresWindow;
  };
}

export default FinishedWindow;
