class GiveUpWindow {
  static render() {
    let el = document.createElement("div");
    el.setAttribute("class", "loooser");
    let text = document.createElement("h1");
    text.textContent = "Try again!";
    el.appendChild(text);
    return el;
  }
}
export default GiveUpWindow;
