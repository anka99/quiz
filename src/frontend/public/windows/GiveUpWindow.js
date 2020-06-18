class GiveUpWindow {
    constructor() {
        this.render = () => {
            return this.element;
        };
        this.element = document.createElement("div");
        this.element.setAttribute("class", "loooser");
        let text = document.createElement("h1");
        text.textContent = "Try again!";
        this.element.appendChild(text);
    }
}
export default GiveUpWindow;
//# sourceMappingURL=GiveUpWindow.js.map