var inquirer = require("inquirer");
//var letter = require('./letter.js');
//var word = require("./word.js");

var firstGame = true;
var guessesRemaining = 10;
var selectedWords = {};
var wordList =
[
	"JAVASCRIPT", "NODE", "PROTOTYPE",
	"FUNCTION", "BOOLEAN", "JSON",
	"ARRAY", "BOOTSTRAP", "VARIABLE",
	"GITHUB", "HEROKU", "JQUERY"
];
var guessedArray = [];
var notguessedArray = 
[
	"A", "B", "C", "D", "E", "F", "G", "H", "I",
	"J", "K", "L", "M", "N", "O", "P", "Q", "R",
	"S", "T", "U", "V", "W", "X", "Y", "Z"
];

var lettersToReveal = [];
var displayString = "";


function clear()
{
	process.stdout.write('\033[2J');
	process.stdout.write('\033[0f');
};

function randomWordSelector()
{
	var startingObjLength = Object.keys(selectedWords).length;
	var randomizer = Math.floor((Math.random() * wordList.length));	
	var chosenWord = wordList[randomizer];

	selectedWords[chosenWord] = randomizer;
	var endingObjLength = Object.keys(selectedWords).length;
	if (startingObjLength === endingObjLength)
	{
		randomWordSelector();
		return;
	} else { return chosenWord; }
}







function Letter(word, letter)
{
	this.letter = letter;
	this.wordToMatch = word;
	this.indexOfHits = [];
	this.containedInWord = false;
	this.checkGuess = function checkGuess()
	{
		guessesRemaining--;

		if (this.letter === this.letter.toLowerCase())
		{
			this.letter = this.letter.toUpperCase();
		}
		guessedArray.unshift(this.letter);
		
		for (i = 0; i < this.wordToMatch.word.length; i++)
		{
			if (this.wordToMatch.lettersArray[i] === this.letter)
			{
				this.indexOfHits.push(i);
				this.containedInWord = true;
			}
		}
		
		if (!this.containedInWord)
		{
			console.log("\nIncorrect! There are no " + this.letter + "'s in the word.")
		}
		return this.indexOfHits;
	};
}


function WordUp(word)
{
	this.word = word;
	this.charsToGuess = this.word.length;
	this.solved = false;
	this.lettersArray = this.word.split("");
	this.updateDisplayString = function updateDisplayString(indexArray)
	{

		if (!indexArray)
		{
			for (i = 0; i < this.lettersArray.length; i++)
			{ lettersToReveal.push("_ "); }
			advanceGame(lettersToReveal, false);
		}

		else
		{
			for (i = 0; i < indexArray.length; i++)
			{
				var indexValue = indexArray[i];
				lettersToReveal[indexValue] = this.lettersArray[indexValue];
			}
			this.charsToGuess -= (indexArray.length);
			if (this.charsToGuess === 0) { this.solved = true; }

			advanceGame(lettersToReveal, true, this);
		}
	}
}

function playGame()
{
	if (firstGame)
	{
		console.log("");
		console.log("Welcome To Command Line Hangman!");
		console.log("All the words in this game will be related to web development and javascript programming.\n");
		inquirer.prompt
		([
			{
				type: "confirm",
				name: "ready",
				message: "Are you ready to begin playing?"
			}
		]).then(function(answers)
		{
			if (answers.ready)
			{
				firstGame = false;
				clear();
				playGame();
			} else { playGame(); }
		})
	}

	else
	{
		if (guessesRemaining === 10)
		{
			var currentWord = new WordUp(randomWordSelector());
			console.log("Current Word: " + currentWord.word);
			currentWord.updateDisplayString(false);
		}

		else if (guessesRemaining > 0 && guessesRemaining < 10)
		{
			clear();
			console.log(displayString + "\n");
		}
		
		promptForLetter(currentWord);
	}
}


function advanceGame(array, ask, currentWord)
{
	var tempString = "0".repeat(array.length);
	for (k = 0; k < array.length; k++)
	{
		displayString = tempString.replace(/0/, lettersToReveal[k] + " ");
		tempString = displayString;
	}

	console.log("\n" + displayString + "\n");

	if (ask === false) { return; }
	else if (guessesRemaining < 0)
	{
		console.log("I'm sorry!, you've run out of attempts.");

		inquirer.prompt
		([
			{
				type: "confirm",
				name: "reveal",
				message: "Would you like to have this word revealed?"
			}
		]).then(function(answers)
		{
			if (answers.reveal)
			{
				console.log("The word was " + currentWord.word.toUpperCase() + ".\n");
			}

			else
			{
				console.log("Well, alright then.");
			}
		})
	}

	else if (!currentWord.solved)
	{
		promptForLetter(currentWord);
	}
	else
	{
		console.log("");
		console.log("You did it!  Congratulations!")
		console.log("");
		return;
	}
}

function promptForLetter(currentWord, callback)
{
	inquirer.prompt
	([
		{
			type: "input",
			name: "guess",
			message: "Guess a letter:",
			validate: function (value)
			{
				if (value.charCodeAt(0) < 65 || (value.charCodeAt(0) > 90 && value.charCodeAt(0) < 97) || value.charCodeAt(0) > 122)
				{
					return false;
				} else { return true; }
			}
		}
	]).then(function(answers)
	{
		//clear();
		var currentLetter = new Letter(currentWord, answers.guess);
		var indexMatches = currentLetter.checkGuess();
		currentWord.updateDisplayString(indexMatches);
	})
}


clear();
playGame();



