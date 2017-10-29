var word = "BOOTSTRAP";
var wordArray = word.split("");


var tempString = "000000000";
var displayString = tempString.replace(/0/, wordArray[0]);
tempString = displayString;
console.log(displayString);
displayString = tempString.replace(/0/, wordArray[1]);
tempString = displayString;
console.log(displayString);
displayString = tempString.replace(/0/, wordArray[2]);
tempString = displayString;
console.log(displayString);

console.log("");
console.log("");
console.log("");
console.log("Temp: " + tempString);
console.log("");
console.log("Display: " + displayString);