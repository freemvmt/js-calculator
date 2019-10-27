# Basic Calculator in Vanilla JS

## Notes on this project

* This calculator is built for the FAC pre-course
* It is written in vanilla Javascript (i.e. without frameworks)
* It follows the user design brief of the [advanced front end calculator project](https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/build-a-javascript-calculator) on *freeCodeCamp*

## Functionality

* The calculator's input mode is formulaic, rather than immediate-executional, meaning the user can enter the full equation they would like calculated, without adjusting for order of operation, before hitting the equals (=) key
* This makes for a more declarative rather than imperative approach, where the computer will determine in what order to conduct operations (according to the usual hierarchy of division first, followed by multiplication, addition, and finally subtraction)
* Negative numbers can be handled by pushing the subtract (-) key before entering the value in question (this is only permitted immediately after hitting either the mutliplication (x) or division (/) key)
* A basic recall function is available: pressing the memory storage key (M) will store the full contents of the display at that instant, which can later be added to the input stream by pressing the same key again, simultaneously clearing the storage
* The last answer (ANS) key recalls the result of the most recent evaluation and adds it to the input stream
* Results are displayed to five decimal places, but when recalled, are precise up to the limits of floating point numbers (although will not be represented on screen as such)
