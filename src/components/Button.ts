class Button {
  private onClick: () => void;
  private className: string;
  private innerHTML: string;

  constructor(className: string, innerHTML: string, onClick: () => void) {
    this.onClick = onClick;
    this.className = className;
    this.innerHTML = innerHTML;
  }
  render(): HTMLElement {
    let button = document.createElement("button");
    button.innerHTML = this.innerHTML;
    button.setAttribute("class", this.className);
    button.addEventListener("click", this.onClick);
    return button;
  }
}

export default Button;
