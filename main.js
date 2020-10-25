const clearBtn = document.querySelector('#clear');
const allClearBtn = document.querySelector('#allclear');
const equalBtn = document.querySelector('.equal');
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
let activeOp = document.querySelector('.active');

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
allClearBtn.addEventListener('click', () => {
  valueA = valueB = total = '';
  blink();
  try {
    activeOp.classList.toggle('active');
    activeOp = null;
  } catch {}
});

// when user presses clear, clear the display
clearBtn.addEventListener('click', () => {
  blink();

  !activeOp ? (valueA = '') : (valueB = '');
});

// user clicks the negate button
negateBtn.addEventListener('click', () => {
  if (inputDisplay.innerHTML != 0 && !valueA && !valueB) {
    valueA = total;
    negate();
  }
});

// when user presses the percent button, transform number to decimal
percentageBtn.addEventListener('click', percentify);

// when a user presses a decimal, check if number already includes a decimal
decimalbtn.addEventListener('click', () => {
  const number = Number(inputDisplay.innerHTML);
  if (number % 1 == 0) transformVal('dec', '.');
});

// when a user presses the equal btn, do math
equalBtn.addEventListener('click', () => {
  updateValues(Number(valueA), Number(valueB));

  // remove active operator
  try {
    activeOp.classList.toggle('active');
    activeOp = null;
  } catch (error) {}

  // reset values
  valueA = valueB = '';
});

// FUNCTIONS
// show numbers on display
function updateDisplay() {
  if (!activeOp) {
    if (valueA.length != 16) {
      valueA += this.value;
      blink(valueA);
    }
  } else {
    if (valueB.length != 16) {
      valueB += this.value;
      blink(valueB);
    }
  }
  previousBtn = this;
}

// show which operator is active
function updateOperator() {
  // check if user wanted to swtich operators
  if (activeOp && previousBtn.classList.contains('operator')) {
    switchOperators(this, activeOp);
    // else check if there is no set active
  } else if (!activeOp) {
    activeOp = this;
    activeOp.classList.toggle('active');
    // else solve the equation
  } else {
    updateValues(Number(valueA), Number(valueB));
    switchOperators(this, activeOp);
    // set new values
    valueA = total;
    valueB = '';
  }

  previousBtn = this;
}

function switchOperators(newOp, prevOp) {
  prevOp.classList.toggle('active');
  activeOp = newOp;
  activeOp.classList.toggle('active');
}

// MATH FUNCTIONS

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

function transformVal(method, val) {
  if (method == 'mult') {
    if (!activeOp) {
      valueA = Number(valueA) * val;
      blink(valueA);
    } else {
      valueB = Number(valueB) * val;
      blink(valueB);
    }
  } else {
    if (!activeOp) {
      valueA += val;
      blink(valueA);
    } else {
      valueB += val;
      blink(valueB);
    }
  }
}
// operate - takes an operator and 2 numbers
function operate(operator, num1, num2) {
  switch (operator) {
    case 'add':
      return add(num1, num2);
      break;
    case 'subtract':
      return subtract(num1, num2);
      break;
    case 'multiply':
      return multiply(num1, num2);
      break;
    case 'divide':
      return divide(num1, num2);
  }
}

// operate helper function
function updateValues(valueA, valueB) {
  try {
    operator = activeOp.value;
    total = operate(operator, valueA, valueB);
    total = parseFloat(total.toFixed(10));
    blink(total);
  } catch (error) {
    valueA = valueB = total = '';
    blink();
  }
}

function blink(value = 0) {
  inputDisplay.innerHTML = '';
  setTimeout(() => {
    inputDisplay.innerHTML = numberWithCommas(value);
  }, 100);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
