/* Functions to write:
1. input of numbers and decimal points
2. input of operands
3. deletion of inputs of either kind
4. execution of on-screen expression and representation of result
5. total reset
6. last answer recall
7. memory storage and recall
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

let pad = document.querySelector('#input-container');
let nums = [...document.querySelectorAll('.button-input')];
let ops = [...document.querySelectorAll('.button-operator')];
console.log(nums);
console.log(ops);

// input
var addToDisplay = function(event) {
  let display = document.getElementById('display'); // now display points to the display element
  //let displayString = display.innerHTML; // this just copies the text in the display to a primitive variable displayString
  //console.log(displayString);
  //display.innerHTML = '1000 +';
  
}

pad.addEventListener('click', addToDisplay);
