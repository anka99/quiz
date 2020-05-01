class Entry {
  static render() {
    let el = document.createElement("div");
    let text = document.createElement("p");
    text.textContent = "start ur quiz";
    el.appendChild(text);
    return el;
  }
}

export default Entry;
