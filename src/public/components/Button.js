class Button {
    constructor(className, id, innerHTML, onClick) {
        this.onClick = onClick;
        this.className = className;
        this.innerHTML = innerHTML;
        this.id = id;
    }
    render() {
        let button = document.createElement("button");
        button.innerHTML = this.innerHTML;
        button.setAttribute("class", this.className + " button");
        button.setAttribute("id", this.id);
        button.addEventListener("click", this.onClick);
        return button;
    }
}
export default Button;
//# sourceMappingURL=Button.js.map