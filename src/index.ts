import "./style.css";
import Icon from "./icon.png";
import "./types"

function component() {
  const element = document.createElement("div");

  element.innerHTML = ["Hello", "webpack", 123, 456].join(" ");
  // element.classList.add("hello");

  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
