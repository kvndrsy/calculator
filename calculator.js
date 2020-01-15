"use strict";

let isOperatorActive = false;
let isDecimalActive = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default:  console.log("Invalid operator.");
  }
}

function inputDigit(display, buttonValue) {
  if (display.innerText === "0") {
    display.innerText = buttonValue;
  } else {
    display.innerText += buttonValue;
  }
  isOperatorActive = false;
}

function inputOperator(display, buttonValue) {
  if (isOperatorActive) {
    display.innerText = display.innerText.slice(0,-1) + buttonValue;
  } else if (display.innerText.slice(-1) === ".") {
    display.innerText = display.innerText.slice(0,-1) + buttonValue;
    isOperatorActive = true;
  } else {
    display.innerText += buttonValue;
    isOperatorActive = true;
  }
  isDecimalActive = false;
}

function inputDecimal(display, buttonValue) {
  if (!isDecimalActive) {
    if (isOperatorActive) {
      display.innerText += `0${buttonValue}`;
      isOperatorActive = false;
    } else {
      display.innerText += buttonValue;
    }
    isDecimalActive = true;
    // change this boolean toggle to disabling decimal button until operator button is clicked
  }
}

function processButtonClick() {
  const display = document.querySelector("#display");
  const buttonValue = this.innerText;

  if (buttonValue.match(/[0-9]/)) {
    inputDigit(display, buttonValue);
  } else if (buttonValue.match(/[/*+-]/)) {
    inputOperator(display, buttonValue);
  } else if (buttonValue === ".") {
    inputDecimal(display, buttonValue);
  } else if (buttonValue === "=") {
    // evaluate expression in display here
  } else if (buttonValue === "C") {
    display.innerText = "0";
    isOperatorActive = false;
    isDecimalActive = false;
  }
}

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", processButtonClick));