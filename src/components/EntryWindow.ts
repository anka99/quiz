class EntryWindow {
  private element: HTMLElement;
  constructor() {
    this.element = document.createElement("div");
    this.element.setAttribute("class", "rules");
    let text = document.createElement("h1");
    text.textContent = "rules";
    this.element.appendChild(text);
  }
  render() {
    return this.element;
  }
}

export default EntryWindow;
