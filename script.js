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
- might be easier (and more in keeping with functional programming norms) to only parse
the displayed string on execution rather than constantly during input phase
*/
