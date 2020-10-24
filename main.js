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
