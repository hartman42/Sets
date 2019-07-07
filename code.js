audio.addEventListener('ended', (event) => {
	//stamp it
	updateLastPlayed();
	//find the next tune's row
	getNextValidRow();
	//load it as the source of the audio element
	loadNext();
	//play the thing
	audio.play();
});

function loadNext() {
  audio.src = getAudioFile();
}

function getNextValidRow() {
	currentRow++;
	while (!range.values[currentRow][range.values[0].indexOf('Audio File')]) {
		currentRow++;
	}
}

