"use strict";

const display = document.querySelector("#display");
const result = document.querySelector("#result");

let displayValues = [];
let resultValue = 0;
let currentValueString = "";
let isOperatorActive = false;
let isDecimalActive = false;
let isDivisionByZero = false;
let isDisplayEvaluated = false;

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
  if (b === 0) isDivisionByZero = true;
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

function findOperatorIndex(array, regularExpression) {
  for (let index in array) {
    if (array[index].toString().match(regularExpression)) return +index;
    // index is apparently a string, while a number is anticipated as the return value
  }
}

function executeOrderOfOperations(operatorsRegEx) {
  while (true) {
    let index = findOperatorIndex(displayValues, operatorsRegEx);
    if (!index) break;

    let newValue = operate(displayValues[index], displayValues[index - 1], displayValues[index + 1]);
    if (isDivisionByZero) break;

    displayValues.splice(index - 1, 3, newValue);
  }
}

function inputDigit(buttonValue) {
  if (display.innerText !== "0" && !isDisplayEvaluated) {
    display.innerText += buttonValue;
  } else {
    display.innerText = buttonValue;
  }

  if (isDisplayEvaluated) {
    currentValueString = buttonValue;
    result.innerText = "";
    displayValues = [];
  } else {
    currentValueString += buttonValue;
  }

  isOperatorActive = false;
  isDivisionByZero = false;
  isDisplayEvaluated = false;
}

function inputOperator(buttonValue) {
  if (isOperatorActive) {
    display.innerText = display.innerText.slice(0, -1) + buttonValue;
  } else if (display.innerText.slice(-1) === ".") {
    display.innerText = display.innerText.slice(0, -1) + buttonValue;
    currentValueString = currentValueString.slice(0, -1);
  } else {
    if (isDisplayEvaluated) display.innerText = resultValue + buttonValue;
    else display.innerText += buttonValue;
  }

  if (currentValueString !== "") {
    if (isDisplayEvaluated) {
      displayValues.push(buttonValue);
    } else {
      displayValues.push(+currentValueString, buttonValue);
    }
    currentValueString = "";
  } else if (!displayValues.length) {
    displayValues.push(0, buttonValue);
    if (isDivisionByZero) {
      result.innerText = "";
    }
  } else {
    displayValues.splice(-1, 1, buttonValue);
  }
  
  isOperatorActive = true;
  isDecimalActive = false;
  isDivisionByZero = false;
  isDisplayEvaluated = false;
}

function inputDecimal() {
  if (!isDecimalActive) {
    if (!isOperatorActive && !isDisplayEvaluated) {
      display.innerText += ".";
      currentValueString += ".";
    } else {
      if (isDisplayEvaluated) {
        display.innerText = "0.";
        currentValueString = "0.";
        result.innerText = "";
        displayValues = [];
      } else {
        display.innerText += "0.";
        currentValueString += "0.";
      }
    }

    isOperatorActive = false;
    isDecimalActive = true;
    isDivisionByZero = false;
    isDisplayEvaluated = false;
  }
}

function inputEqualSign() {
  if (isOperatorActive) {
    display.innerText = display.innerText.slice(0, -1) + "=";
    displayValues.pop();
  } else if (display.innerText.slice(-1) === ".") {
    display.innerText = display.innerText.slice(0, -1) + "=";
    displayValues.push(+currentValueString);
  } else if (isDisplayEvaluated) {
    display.innerText = resultValue + "=";
    if (isDivisionByZero) displayValues.push(0);
  } else {
    display.innerText += "=";
    displayValues.push(+currentValueString);
  }

  currentValueString = "";
  isOperatorActive = false;
  isDecimalActive = false;
  isDivisionByZero = false;
  isDisplayEvaluated = false;
}

function evaluateDisplay() {
  executeOrderOfOperations(/[*/]/);
  if (!isDivisionByZero) {
    executeOrderOfOperations(/[+-]/);
    resultValue = displayValues[0];
    result.innerText = resultValue;
    currentValueString += resultValue;
  } else {
    result.innerText = "Cannot divide by zero.";
    resultValue = 0;
    currentValueString = "";
    displayValues = [];
  }

  isDisplayEvaluated = true;
}

function resetCalculator() {
  display.innerText = "0";
  result.innerText = "";
  displayValues = [];
  resultValue = 0;
  currentValueString = "";
  isOperatorActive = false;
  isDecimalActive = false;
  isDivisionByZero = false;
  isDisplayEvaluated = false;
}

function processButtonClick() {
  const buttonValue = this.innerText;

  if (buttonValue.match(/[0-9]/)) {
    inputDigit(buttonValue);
  } else if (buttonValue.match(/[*/+-]/)) {
    inputOperator(buttonValue);
  } else if (buttonValue === ".") {
    inputDecimal();
  } else if (buttonValue === "=") {
    inputEqualSign();
    evaluateDisplay();
  } else if (buttonValue === "C") {
    resetCalculator();
  }
}

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", processButtonClick));