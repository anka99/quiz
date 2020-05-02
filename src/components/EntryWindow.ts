class EntryWindow {
  static render() {
    let el = document.createElement("div");
    el.setAttribute("class", "rules");
    let text = document.createElement("h1");
    text.textContent = "rules";
    el.appendChild(text);
    return el;
  }
}

export default EntryWindow;
