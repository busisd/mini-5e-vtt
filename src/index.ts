import "./resources/style.css";
import Icon from "./resources/icon.png";
import "./testScript"

function component() {
  const element = document.createElement("div");

  element.innerHTML = "Page contents WIP";
  // element.classList.add("hello");

  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
