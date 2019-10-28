/* Functions to write:
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

// make function to handle inputs to the displayed expression
var addToDisplay = function(event) {
  // initialise diagnostic strings
  let lastChar = display.textContent.slice(-1);
  let lastNum = (display.textContent.match(/[.0-9]+$/) || [''])[0]; // captures last run of digits (w/ or w/o decimal point), or else resolves to an empty string
  let lastOps = (display.textContent.match(/[+-/*]+$/) || [''])[0]; // captures last run of operators, or else resolves to an empty string

  // then deal with the screen displaying a result of execution
  if (justExecuted) {
    justExecuted = false; // reset execution monitor
    if (operators.includes(event.target)) {
      event.target == divideButton ? display.textContent += '/' :
        event.target == multiplyButton ? display.textContent += '*' :
        display.textContent += event.target.textContent;
    }
    else if (event.target == pointButton) {
      display.textContent = '0.';
    }
    else if (nums.includes(event.target)) {
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
    lastResult = eval(submission); // is use of eval safe here because the possible inputs are tightly controlled?
    // we will represent the number rounded to 5 decimal places, where necessary
    display.textContent = +(lastResult.toFixed(5));
    justExecuted = true;
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
      console.log(`stored in memory: ${memory}`);
    }
    // recall, when memory non-empty
    else {
      let k = memory.length;
      let d = display.textContent.length;
      let origin = display.textContent;
      for (let i=0;i<k;i++) {
        console.log(memory.charAt(i));
        addToDisplay(memory.charAt(i));
      }
      console.log(`memory length: ${d}`);
      console.log(`original display length: ${k}`);
      console.log(`new display length: ${display.textContent.length}`);
      if (d + k == display.textContent.length) { // test for compatibility
        memory = ''; // if successful, reset memory for future storage
        console.log('compatible!');
      }
      else {
        display.textContent = origin // else, reset display and keep memory intact for future attempt
        console.log('compatibility failure');
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
