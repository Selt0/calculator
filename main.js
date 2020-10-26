const clearBtn = document.querySelector('#clear');
const allClearBtn = document.querySelector('#allclear');
const backspaceBtn = document.querySelector('#delete');
const equalBtn = document.querySelector('#equal');
const negateBtn = document.querySelector('#negate');
const inputDisplay = document.querySelector('.input');
let valueA = '';
let valueB = '';
let total;

// number buttons
const numbers = document.querySelectorAll('.number');
const decimalbtn = document.querySelector('#decimal');
const percentageBtn = document.querySelector('#percentage');

// operator buttons
const operators = document.querySelectorAll('.operator');

// active operator
let activeOp = document.querySelector('.active') || null;

// track the button the user has pressed (number or function)
let previousBtn;

// when a user presses a number, update display
numbers.forEach((number) => {
  number.addEventListener('click', updateDisplay);
});

// when a user presses an operator, update operator
operators.forEach((operator) => {
  operator.addEventListener('click', updateOperator);
});

// all clear / hard reset
allClearBtn.addEventListener('click', hardReset);

// when user presses clear, clear the display
clearBtn.addEventListener('click', clearDisplay);

// user clicks the negate button
negateBtn.addEventListener('click', negate);

// user clicks backspace
backspaceBtn.addEventListener('click', () => {
  transformVal('del');
});

// when user presses the percent button, transform number to decimal
percentageBtn.addEventListener('click', percentify);

// when a user presses a decimal, check if number already includes a decimal
decimalbtn.addEventListener('click', addDecimal);

// when a user presses the equal btn, do math
equalBtn.addEventListener('click', solve);

/*
=========
FUNCTIONS
========
*/

// decimal button
function addDecimal() {
  const number = Number(inputDisplay.innerHTML);
  if (number == 0) {
    !activeOp ? (valueA = '0') : (valueB = '0');
  }
  if (number % 1 == 0) {
    transformVal('dec', '.');
  }
}
// equal button
function solve() {
  updateValues(Number(valueA), Number(valueB));

  // remove active operator
  try {
    activeOp.classList.toggle('active');
    activeOp = null;
  } catch (error) {}

  // reset values
  valueA = valueB = '';
}

// clear button
function clearDisplay() {
  blink();

  !activeOp ? (valueA = '') : (valueB = '');
}

// all clear button
function hardReset() {
  valueA = valueB = total = '';
  blink();
  try {
    activeOp.classList.toggle('active');
    activeOp = null;
  } catch {}
}

// show numbers on display
function updateDisplay(key = '') {
  // save ele as keyboard or btn interaction
  const ele = this instanceof Window ? key : this;
  if (!activeOp) {
    if (valueA.length != 16) {
      valueA += ele.dataset.key;
      blink(valueA);
    }
  } else {
    if (valueB.length != 16) {
      valueB += ele.dataset.key;
      blink(valueB);
    }
  }
  previousBtn = ele;
}

// show which operator is active
function updateOperator(key = '') {
  // save ele as keyboard or btn interaction
  const ele = this instanceof Window ? key : this;
  // check if user wanted to swtich operators
  if (activeOp && previousBtn.classList.contains('operator')) {
    switchOperators(ele, activeOp);
    // else if there is no set active, set one
  } else if (!activeOp) {
    activeOp = ele;
    activeOp.classList.toggle('active');
    // else solve the equation
  } else {
    updateValues(Number(valueA), Number(valueB));
    switchOperators(ele, activeOp);
    // set new values
    valueA = total;
    valueB = '';
  }

  previousBtn = ele;
}

// updateOperator helper
function switchOperators(newOp, prevOp) {
  prevOp.classList.toggle('active');
  activeOp = newOp;
  activeOp.classList.toggle('active');
}

/*
==============
MATH FUNCTIONS
==============
*/

// add
function add(num1, num2) {
  return num1 + num2;
}

// subtract
function subtract(num1, num2) {
  return num1 - num2;
}

// multiply
function multiply(num1, num2) {
  return num1 * num2;
}

// divide
function divide(num1, num2) {
  if (isFinite(num1 / num2)) {
    return num1 / num2;
  } else {
    return 'Error';
  }
}

function negate() {
  transformVal('mult', -1);
}

function percentify() {
  transformVal('mult', 0.01);
}

function transformVal(method, val = '') {
  // if user transforms value after solving, update valueA
  if (!valueA && !valueB) valueA = total;

  if (!activeOp) {
    switch (method) {
      case 'mult':
        valueA = Number(valueA) * val;
        break;
      case 'dec':
        valueA += val;
        break;
      case 'del':
        valueA = valueA.slice(0, -1);
        break;
    }
    blink(valueA);
  } else {
    switch (method) {
      case 'mult':
        valueB = Number(valueB) * val;
        break;
      case 'dec':
        valueB += val;
        break;
      case 'del':
        valueB = valueB.slice(0, -1);
        break;
    }
    blink(valueB);
  }
}

// operate - takes an operator and 2 numbers
function operate(operator, num1, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
  }
}

// operate helper function
function updateValues(valueA, valueB) {
  try {
    operator = activeOp.dataset.key;
    total = operate(operator, valueA, valueB);
    total = parseFloat(total.toFixed(10));
    blink(total);
  } catch (error) {
    console.log(error);
    valueA = valueB = total = '';
    blink();
  }
}

// flash display after input
function blink(value = 0) {
  inputDisplay.innerHTML = '';
  setTimeout(() => {
    inputDisplay.innerHTML = numberWithCommas(value);
  }, 100);
}

function numberWithCommas(x) {
  // if number contains a decimal, don't add commas
  if (x % 1 != 0) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// KEYBOARD FUNCTION

window.addEventListener('keydown', (e) => {
  const key = document.querySelector(`button[data-key='${e.key}']`);
  if (!key) return;

  if (key.classList.contains('number')) {
    updateDisplay(key);
  } else if (key.classList.contains('operator')) {
    updateOperator(key);
  } else if (key.id == 'equal') {
    solve();
  } else if (key.id == 'percentage') {
    percentify();
  } else if (key.id == 'decimal') {
    addDecimal();
  } else if (key.id == 'allclear') {
    hardReset();
  } else if (key.id == 'clear') {
    clearDisplay();
  } else if (key.id == 'negate') {
    negate();
  } else if (key.id == 'delete') {
    transformVal('del');
  }
});
