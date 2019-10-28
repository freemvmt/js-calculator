# Basic Calculator in Vanilla JS

## Notes on this project

* This calculator is built for the FAC pre-course
* It is written in vanilla Javascript (i.e. without frameworks)
* It follows the user design brief of the [advanced front end calculator project](https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/build-a-javascript-calculator) on *freeCodeCamp* (the only 'user story' I don't satisfy is #13 - I require that users delete incorrect operators rather than have them pile up on the display)

## Functionality

* The calculator's input mode is formulaic, rather than immediate-executional, meaning the user can enter the full equation they would like calculated, without adjusting for order of operation, before hitting the equals (=) key
* This makes for a more declarative rather than imperative approach, where the computer will determine in what order to conduct operations (according in this case to the operator precedence built into Javascript, which executes division and multiplication ahead of addition and subtraction and is therefore sufficient for our purposes)
* Negative numbers can be handled by pushing the subtract (-) key before entering the value in question, so can be placed after any other operator for this purpose
* A basic recall function is available: pressing the memory storage (M) key will store the full contents of the display at that instant, which can later be added to the input stream by pressing the same key again, simultaneously clearing the storage
* The last answer (ANS) key recalls the result of the most recent evaluation and adds it to the input stream
* Both the above recall buttons will only work if they result in a legitimate expression
* Results are displayed rounded to five decimal places, and when recalled, this is the level of precision available
