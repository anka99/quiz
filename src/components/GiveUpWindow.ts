class GiveUpWindow {
  static render() {
    let el = document.createElement("div");
    let text = document.createElement("p");
    text.textContent = "fucking looser";
    el.appendChild(text);
    return el;
  }
}
export default GiveUpWindow;
