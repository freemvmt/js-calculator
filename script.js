/* Notes:
- might be easier (and more in keeping with functional programming norms) to only parse the displayed string on execution rather than constantly during input phase
- can catch all button press events on the input-container div because they will all bubble up through it
- will need to think about cases where infinities are involved (e.g. division by zero)
*/

// assign event-catching container to a variable
let pad = document.querySelector('#input-container');

// assign display span, which will accept inputs to eventually give the expression to execute, to a variable
let display = document.querySelector('#display');

// assign arrays of button categories to variables
let inputs = [...document.querySelectorAll('.button-input')];
let nums = inputs.slice(0.10);
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

// initialise useful regular expressions
let opRegex = /[+-/*]+/ // matches any run of operators (possibilities: +,-,*,/,+-,*-,/-)
let numRegex = /[0-9]+/ // matches any run of numbers

// initialise global mutable variables (betraying functional programming...)
var memory = '';
var lastResult = '';
var justExecuted = false;

// make dictionary object to relate display characters of elements to their ids
let dict = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  '.': 'point',
  '+': 'add',
  '-': 'subtract',
  '/': 'divide',
  '*': 'multiply'
}

// make function to handle inputs to the displayed expression
var addToDisplay = function(event) {
  // initialise diagnostic strings
  let lastChar = display.textContent.slice(-1);
  let lastNum = (display.textContent.match(/[.0-9]+$/) || [''])[0]; // captures last run of digits (w/ or w/o decimal point), or else resolves to an empty string
  let lastOps = (display.textContent.match(/[+-/*]+$/) || [''])[0]; // captures last run of operators, or else resolves to an empty string

  // first deal with the screen displaying a result of execution
  if (justExecuted) {
    if (operators.includes(event.target)) {
      justExecuted = false; // reset execution monitor (needs to be inside if tests for appropriate buttons or it will reset on any click)
      event.target == divideButton ? display.textContent += '/' :
        event.target == multiplyButton ? display.textContent += '*' :
        display.textContent += event.target.textContent;
    }
    else if (event.target == pointButton) {
      justExecuted = false;
      display.textContent = '0.';
    }
    else if (nums.includes(event.target)) {
      justExecuted = false;
      display.textContent = event.target.textContent;
    }
  }

  // then deal with initial/reset case (display text == '0')
  else if (display.textContent.length == 1 && lastChar == '0') {
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

  // and finally deal with normal flow
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
}

// make function to handle deletions
var backspace = function(event) {
  if (event.target == backButton) {
    display.textContent = display.textContent.slice(0,-1);
  }
}

// make function to handle execution of on-screen expression
var execute = function(event) {
  if (event.target == equalsButton) {
    // before submitting our expression to evaluation we have to trim any operators
    let lastOps = (display.textContent.match(/[+-/*]+$/) || [''])[0];
    let submission = lastOps.length > 0 ? display.textContent.slice(0,-lastOps.length) : display.textContent;
    // is use of eval safe here because the possible inputs are tightly controlled?
    display.textContent = lastResult = (+(eval(submission).toFixed(5))).toString(); // we will represent the number rounded to 5 decimal places, where necessary
    justExecuted = true; // flip execution monitor
  }
}

// make function to handle total reset
var reset = function(event) {
  if (event.target == clearButton) {
    memory = '';
    lastResult = '';
    justExecuted = false;
    display.textContent = '0';
  }
}

// make function to enable memory storage and recall
var remember = function(event) {
  if (event.target == memButton) {
    // storage, when memory empty
    if (memory == '') {
      memory = display.textContent;
    }
    // recall, when memory non-empty
    else {
      // need to cover same cases as usual input function
      if (justExecuted) {
        display.textContent = memory;
        memory = '';
        justExecuted = false;
      }
      else if (display.textContent.length == 1 && lastChar == '0') {
        display.textContent = memory;
        memory = '';
      }
      let k = memory.length;
      let d = display.textContent.length;
      let origin = display.textContent;
      for (let i=0;i<k;i++) {
        let char = memory.charAt(i);
        document.getElementById(dict[char]).click(); // use dictionary to decide element on which to produce virtual click event
      }
      d + k == display.textContent.length ? // test for compatibility
        memory = '' : // if successful, reset memory for future storage
        display.textContent = origin; // else, reset display and keep memory intact for future attempt
      }
    }
  }

// make function to enable last answer recall
var recall = function(event) {
  if (event.target == ansButton) {
    if (justExecuted) {
      // no need to re-assign the display to lastResult, since it should still show the result in question
      justExecuted = false;
    }
    else if (display.textContent.length == 1 && lastChar == '0') {
      display.textContent = lastResult;
    }
    else {
      // follow same method as remember to ensure compatibility of lastResult with currently displayed expression
      let k = lastResult.length;
      let d = display.textContent.length;
      let origin = display.textContent;
      for (let i=0;i<k;i++) {
        let char = lastResult.charAt(i);
        document.getElementById(dict[char]).click();
      }
      if (!(d + k == display.textContent.length)) {
        display.textContent = origin;
      }
    }
  }
}

// attach all event listeners to the input-container object
pad.addEventListener('click',addToDisplay);
pad.addEventListener('click',backspace);
pad.addEventListener('click',execute);
pad.addEventListener('click',reset);
pad.addEventListener('click',remember);
pad.addEventListener('click',recall);
