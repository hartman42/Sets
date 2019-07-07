var currentRow = 0;
var showColumns = '[Title][Last Played]';
var range;
var mustHave = 'Audio File';

audio.addEventListener('ended', (event) => {
	//stamp it
	updateLastPlayed();
	//find the next tune's row
	setNextValidRow();
	//load it as the source of the audio element
	loadNext();
	//play the thing
	audio.play();
});

function setNextValidRow() {
	while (currentRow < range.values.length) {
		currentRow++;
		//are we at the bottom of the list?
		if (currentRow==range.values.length) {
			//reset to the first row and bail
			currentRow = 1;
			break;
		}
		//is this a good row?
		if (range.values[currentRow][range.values[0].indexOf(mustHave)]) {
			//yes - it has an audio file
			break;
		}
	}
}

function loadNext() {
  audio.src = getFileName('Audio File');
  leadSheet.data = getFileName('Eb Lead Sheet') + '#view=FitV&toolbar=0&navpanes=0&scrollbar=0';
}

function loadFirstTune() {
	//get the row of the last tune played
	var mostRecentTime;
	for (var i = 1; i < range.values.length; i++) {
		if (range.values[i][range.values[0].indexOf('Last Played')]) {
			if (mostRecentTime) {
				var d = new Date(range.values[i][range.values[0].indexOf('Last Played')]);
				if (d > mostRecentTime) {
					currentRow = i;
					mostRecentTime = d;
				}
			} else {
				mostRecentTime = new Date(range.values[i][range.values[0].indexOf('Last Played')]);
				currentRow = i;
			}
		}
	}
	//no valid rows with last played
	if (currentRow==0) {currentRow=i-1;}

	//get the next tune
	setNextValidRow();

	audio.src = getFileName('Audio File');
	leadSheet.data = getFileName('Eb Lead Sheet') + '#view=FitV&toolbar=0&navpanes=0&scrollbar=0';
}

function getFileName(field) {
	var f = range.values[currentRow][range.values[0].indexOf(field)];
	return f.replace(/\?dl\=0/g,'?raw=1');
}
