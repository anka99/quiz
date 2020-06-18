class GiveUpWindow {
  private element: HTMLElement;
  constructor() {
    this.element = document.createElement("div");
    this.element.setAttribute("class", "loooser");
    let text = document.createElement("h1");
    text.textContent = "Try again!";
    this.element.appendChild(text);
  }
  render = () => {
    return this.element;
  };
}
export default GiveUpWindow;
