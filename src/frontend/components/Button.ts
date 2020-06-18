class Button {
  private onClick: () => void;
  private className: string;
  private innerHTML: string;
  private id: string;

  constructor(
    className: string,
    id: string,
    innerHTML: string,
    onClick: () => void
  ) {
    this.onClick = onClick;
    this.className = className;
    this.innerHTML = innerHTML;
    this.id = id;
  }
  render(): HTMLElement {
    const button = document.createElement("button");
    button.innerHTML = this.innerHTML;
    button.setAttribute("class", this.className + " button");
    button.setAttribute("id", this.id);
    button.addEventListener("click", this.onClick);
    return button;
  }
}

export default Button;
