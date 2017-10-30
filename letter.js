function Letter(word, letter, guessArray, guessesLeft, msg)
{
	this.letter = letter;
	this.wordToMatch = word;
	this.indexOfHits = [];
	this.containedInWord = false;
	this.guessArray = guessArray;
	this.guessesLeft = guessesLeft;
	this.message = msg;
	this.returnObject = {};
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
			this.message = "You've already chosen letter " + this.letter
			+ " for this puzzle.\nPlease choose a different letter.";

			this.returnObject = {};
			this.returnObject.message = this.message;
			this.returnObject.guessesRemaining = this.guessesLeft;
			this.returnObject.guessedArray = this.guessArray;
			this.returnObject.duplicate = true;
			this.returnObject.indexOfHits = this.indexOfHits;
			return this.returnObject;
		}

		this.guessArray.unshift(this.letter);
		
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
			this.message = "Incorrect! There are no " + this.letter + "'s in the word.";
		}

		else if (this.containedInWord)
		{
			this.message = "Excellent! '" + this.letter + "' was the right choice!"
		}

		this.returnObject = {};
		this.returnObject.message = this.message;
		this.returnObject.guessesRemaining = this.guessesLeft;
		this.returnObject.guessedArray = this.guessArray;
		this.returnObject.duplicate = false;
		this.returnObject.indexmatches = this.indexOfHits;
		return this.returnObject;
	};
}

module.exports = Letter;
