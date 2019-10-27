/* Functions to write:
- execution of on-screen expression and representation of result
- total reset
- last answer recall
- memory storage and recall
*/

/* Global variables required:
1. string currently displayed on screen
2. working array of numbers and operands representing the expression to be executed
3. the result of the most recent evaluation
4. the working array stored by pressing M (could be empty)
5. the number string stored by pressing M (could be empty)
(one but not both of the above two could be empty after an M press)
*/

/* Notes:
- might be easier (and more in keeping with functional programming norms) to only parse the displayed string on execution rather than constantly during input phase
- can catch all button press events on the input-container div because they will all bubble up through it
*/

// assign event-catching container to a variable
let pad = document.querySelector('#input-container');

// assign display span, which will accept inputs to eventually give the expression to execute, to a variable
let display = document.querySelector('#display');

// assign arrays of button categories to variables
let inputs = [...document.querySelectorAll('.button-input')];
let nonZeroNums = inputs.slice(0,9);
let operators = [...document.querySelectorAll('.button-operator')];

// assign special buttons to variables
let zeroButton = document.querySelector('#zero');
let clearButton = document.querySelector('#clear');
let pointButton = document.querySelector('#point');
let equalsButton = document.querySelector('#execute');
let memButton = document.querySelector('#memory');
let ansButton = document.querySelector('#last-answer');
let backButton = document.querySelector('#delete');
let addButton = document.querySelector('#add');
let subtractButton = document.querySelector('#subtract');
let multiplyButton = document.querySelector('#multiply');
let divideButton = document.querySelector('#divide');

// assign useful regular expressions
let opRegex = /[+-/*]+/ // matches any run of operators (possibilities: +,-,*,/,+-,*-,/-)
let numRegex = /[0-9]+/ // matches any run of numbers

// global mutable variables

// make function to handle inputs to display/expression
var addToDisplay = function(event) {
  // initialise diagnostic strings
  let lastChar = display.textContent.slice(-1);
  let lastNum = (display.textContent.match(/[.0-9]+$/) || [''])[0]; // captures last run of digits (w/ or w/o decimal point), or else resolves to an empty string
  let lastOps = (display.textContent.match(/[+-/*]+$/) || [''])[0]; // captures last run of operators, or else resolves to an empty string

  // first deal with initial/reset case (display text == '0')
  if (display.textContent.length == 1 && lastChar == '0') {
    if (nonZeroNums.includes(event.target)) {
      display.textContent = event.target.textContent;
    }
    else if (operators.includes(event.target)) {
      event.target == divideButton ? display.textContent += '/' :
        event.target == multiplyButton ? display.textContent += '*' :
        display.textContent += event.target.textContent;
    }
    else if (event.target == pointButton) {
      display.textContent = '0.';
    }
  }

  // then deal with normal flow
  else {
    // input: 0
    // only case where zero can't be added is if this produces multiple zeroes at start of a number
    if (event.target == zeroButton) {
      if (!(lastNum.length == 1 && lastChar == '0')) {
        display.textContent += '0';
      }
    }
    // input: [1-9]
    // can be added at any point, but should replace single zeroes
    else if (nonZeroNums.includes(event.target)) {
      lastNum == '0' ? display.textContent = display.textContent.slice(0,-1) + event.target.textContent : display.textContent += event.target.textContent;
    }
    // input: .
    // can be added after any character, but not twice in one number
    else if (event.target == pointButton) {
      if (!(lastNum.includes('.'))) {
        if (opRegex.test(lastChar)) {
          display.textContent += '0.';
        }
        else {
          display.textContent += '.';
        }
      }
    }
    // input: [+-/*]
    // can only be added to a number, except -, which can be added once to any operator other than itself
    else if (operators.includes(event.target)) {
      if (event.target == subtractButton) {
        if (lastChar != '-' && lastOps.length < 2) { // i.e. - is pressed and last run is either a number or a single operator other than -
          display.textContent += '-';
        }
      }
      else {
        if (lastOps.length == 0) {
          event.target == divideButton ? display.textContent += '/' :
            event.target == multiplyButton ? display.textContent += '*' :
            display.textContent += '+';
        }
      }
    }
  }
  // not yet handled: case when result is displayed
}

// make function to handle deletions
var backspace = function(event) {
  if (event.target == backButton) {
    display.textContent = display.textContent.slice(0,-1);
  }
}

// make function to handle execution of on-screen expression


// attach all event listeners to the input-container object
pad.addEventListener('click',addToDisplay);
pad.addEventListener('click',backspace);
