class FinishedWindow {
  static render() {
    let el = document.createElement("div");
    let text = document.createElement("p");
    text.textContent = "congratulations 2/10";
    el.appendChild(text);
    return el;
  }
}

export default FinishedWindow;
