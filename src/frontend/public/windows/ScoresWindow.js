let ScoresWindow = (() => {
    class ScoresWindow {
        static renderScoreText(text) {
            let textEl = document.createElement("h2");
            textEl.textContent = text;
            return textEl;
        }
    }
    ScoresWindow.render = (scores, rendered) => {
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
    return ScoresWindow;
})();
export default ScoresWindow;
//# sourceMappingURL=ScoresWindow.js.map