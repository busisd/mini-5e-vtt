import "./resources/style.css";
import Icon from "./resources/icon.png";
import "./testScript";
import {
  d10Svg,
  d12Svg,
  d20Svg,
  d4Svg,
  d6Svg,
  d8Svg,
  plaintextSvg,
  svgElement,
} from "./svg/diceSvg";

function component() {
  const element = document.createElement("div");

  element.innerHTML = "Page contents WIP";
  // element.classList.add("hello");

  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);

  return element;
}

// document.body.appendChild(component());

// const svgText = svgElement(plaintextSvg("test123", {width: 250}));
// const svgD4 = svgElement(d4Svg("4"));
// const svgD6 = svgElement(d6Svg("6"));
// const svgD8 = svgElement(d8Svg("8"));
// const svgD10 = svgElement(d10Svg("10"));
// const svgD12 = svgElement(d12Svg("12"));
// const svgD20 = svgElement(d20Svg("20"));
// document.body.appendChild(svgText);
// document.body.appendChild(svgD4);
// document.body.appendChild(svgD6);
// document.body.appendChild(svgD8);
// document.body.appendChild(svgD10);
// document.body.appendChild(svgD12);
// document.body.appendChild(svgD20);
