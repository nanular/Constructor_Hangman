var inquirer = require("inquirer");
//var letter = require('./letter.js');
//var word = require("./word.js");

var roundCounter = -1;
var guessesRemaining = 10;

var chosenWord = "";
var chosenWordArray = [];

var wordList =
[
	"JAVASCRIPT", "NODE", "PROTOTYPE",
	"FUNCTION", "BOOLEAN", "JSON",
	"ARRAY", "BOOTSTRAP", "VARIABLE",
	"GITHUB", "HEROKU", "JQUERY"
];
var guessedArray = [];

var lettersToReveal = [];
var displayString = "";
var successMsg = "";




function clear()
{
	process.stdout.write('\033[2J');
	process.stdout.write('\033[0f');
}


function sleep(milliseconds)
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e4; i++)
	{
		if ((new Date().getTime() - start) > milliseconds) { break };
	}
}

function randomWordSelector()
{
	var randomizer = Math.floor((Math.random() * wordList.length));	
	chosenWord = wordList[randomizer];
	if (chosenWordArray.some(x => x === chosenWord))
	{
		randomWordSelector();
		return;
	} 

	else
	{
		chosenWordArray.push(chosenWord);
		return chosenWord;
	}
}


function Letter(word, letter)
{
	this.letter = letter;
	this.wordToMatch = word;
	this.indexOfHits = [];
	this.containedInWord = false;
	this.checkForDuplicate = function checkForDuplicate()
	{
		if (guessedArray.indexOf(this.letter) !== -1)
		{ return true; }
		else { return false; }
	}
	this.checkGuess = function checkGuess()
	{

		if (this.letter === this.letter.toLowerCase())
		{
			this.letter = this.letter.toUpperCase();
		}

		if (this.checkForDuplicate())
		{
			successMsg = "You've already chosen letter " + this.letter
			+ " for this puzzle.\nPlease choose a different letter.";
			return false;
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
			guessesRemaining--;
			successMsg = "Incorrect! There are no " + this.letter + "'s in the word.";
		}

		else if (this.containedInWord)
		{
			successMsg = "Excellent! '" + this.letter + "' was the right choice!"
		}
		return this.indexOfHits;
	};
}


function WordUp(word)
{
	this.word = word;
	this.charsToGuess = word.length;
	this.solved = false;
	this.lettersArray = word.split("");
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
			if (lettersToReveal.indexOf("_ ") === -1) { this.solved = true; }

			advanceGame(lettersToReveal, true, this);
		}
	}
}

function playGame()
{
	if (roundCounter < 0)
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
		]).then(function(response)
		{
			if (response.ready)
			{
				roundCounter++;
				clear();
				playGame();
				return;
			} 

			else
			{
				playGame();
				return;
			}
		})
	}

	else
	{
		if (roundCounter === 0)
		{
			randomWordSelector();
			sleep(750);
			console.log(chosenWord + "\n");
			var currentWord = new WordUp(chosenWord);
			console.log("Current Word: " + currentWord.word);
			console.log("Guesses Remaining: " + guessesRemaining);
			currentWord.updateDisplayString(false);
		}

		sleep(1000);
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

	if (ask === false) { return; }

	else if (!currentWord.solved)
	{
		promptForLetter(currentWord);
	}
	else
	{
		clear();
		console.log("Guesses Remaining: " + guessesRemaining + "\n");
		console.log(displayString);
		console.log("");
		console.log("Letters Used: " + guessedArray.toString());
		console.log("");
		console.log("You did it!  Congratulations!")
		console.log("");
		playAgain();
		return;
	}
}

function promptForLetter(currentWord)
{
	if (guessesRemaining === 0)
	{
		clear();
		console.log("Guesses Remaining: " + guessesRemaining + "\n");
		console.log(displayString);
		console.log("");
		console.log("Letters Used: " + guessedArray.toString());
		console.log("");
		console.log("I'm sorry!, you've run out of attempts.");

		inquirer.prompt
		([
			{
				type: "confirm",
				name: "reveal",
				message: "Would you like to have this word revealed?"
			}
		]).then(function(revealResponse)
		{
			if (revealResponse.reveal)
			{
				console.log("\nThe word was " + currentWord.word.toUpperCase() + ".\n");
			}

			else
			{
				console.log("\nWell, alright then.\n");
			}

			playAgain();
			return;
		})
	}

	else if (roundCounter >= 0)
	{
		clear();
		console.log("Guesses Remaining: " + guessesRemaining + "\n");
		console.log(displayString);
		console.log("");
		console.log("Letters Used: " + guessedArray.toString());
		console.log("");
		console.log(successMsg);
	}

	if (guessesRemaining > 0)
	{
		inquirer.prompt
		([
			{
				type: "input",
				name: "guess",
				message: "Guess a letter:",
				validate: function (value)
				{
					if (/^[A-Za-z]$/.test(value)) { return true; }
					else { return false; }
				}
			}
		]).then(function(letterInput)
		{
			roundCounter++;
			currentLetter = new Letter(currentWord, letterInput.guess);
			var indexMatches = currentLetter.checkGuess();
			if (indexMatches !== false)
			{
				currentWord.updateDisplayString(indexMatches);
			}

			else { promptForLetter(currentWord); }
		})
	}
}

function playAgain()
{
	lettersToReveal = [];
	guessesRemaining = 10;
	roundCounter = 0;
	successMsg = "";
	guessedArray = [];
	displayString = "";
	tempString = "";

	if (chosenWordArray.length === wordList.length)
	{
		console.log("\nYou did it! You played all 12 words!");
		console.log("Thanks for playing!\n");
		return;
	}

	console.log("\nYou have played "
		+ chosenWordArray.length + " of the "
		+ wordList.length + " words available.\n")

	inquirer.prompt
	([
		{
			type: "confirm",
			name: "newgame",
			message: "Would you like to try and guess another?"
		}
	]).then(function(newgameAnswer)
	{

		if (newgameAnswer.newgame)
		{
			clear();
			console.log("Loading...")
			setTimeout(playGame, 1200);
			return;
		}

		else
		{
			console.log("\nYou're missing out on the other "
				+ (wordList.length - chosenWordArray.length) + " words available!\n");
			return;
		}
	})

}

clear();
playGame();



