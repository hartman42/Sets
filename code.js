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
  leadSheet.width = lsWidth;
  leadSheet.height = lsHeight;
  changesContainer.innerHTML = buildChangesTable();
}

function buildChangesTable() {
	var tbl = '';
	var iChanges = getChanges(iFldName);
	var aChanges = getChanges(aFldName);
	var bChanges = getChanges(bFldName);
	var cChanges = getChanges(cFldName);
	tbl = '<table>' + iChanges + aChanges + bChanges + cChanges + '</table>';
	return tbl;
}

function getChanges(f) {
	var c = range.values[currentRow][range.values[0].indexOf(f)];
	if (c) {
		var a = c.split(',');
		c = '';
		var m = range.values[currentRow][range.values[0].indexOf(meterField)];
		for (var i = 0; i < a.length; i++) {
			var s = '';
			var e = '';
			if (i%m==0) {
				s += 'border-left:1px solid;';
			}
			if ((i+1)%(4*m)==0) {
				s += 'border-right:1px solid;';
				if ((i+1)!=a.length) {
					e += '</tr><tr>';
				}
			}
			if (s!='') {
				s = ' style="' + s + '"';
			}
			c += '<td' + s + '>' + ((a[i]) ? a[i] : '&nbsp') + '</td>' + e;
		}
		return '<tr>' + c + '</tr>';
	} else {
		return '';
	}
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

	loadNext();

}

function getFileName(field) {
	var f = range.values[currentRow][range.values[0].indexOf(field)];
	return f.replace(/\?dl\=0/g,'?raw=1');
}
