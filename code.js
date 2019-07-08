var currentRow = 0;
var showColumns = '[Title][Last Played]';
var range;
var cTable;
var mustHave = 'Audio File';
var meterField = 'Meter';
var introChangesFldName = 'I Changes';
var changesFldName = 'Changes';
var codaChangesFldName = 'C Changes';
var lsWidth = "480";
var lsHeight = "640";
// var lsWidth = "570";
// var lsHeight = "760";
// var lsWidth = "300";
// var lsHeight = "400";

		//measure is the total number of bars played
		//bars is the number of different bars being played - excluding different endings
		//totalBars is the number of different bars being played - including different endings

var myTimer = setInterval(myTimer,100);

function myTimer() {
	//measure is the total number of bars played
	//bar is the current changes bar being played
	if (cTable) {
		if (cTable.length>0) {
			var secondsPerBar = 60 / (range.values[currentRow][range.values[0].indexOf('BPM')] / range.values[currentRow][range.values[0].indexOf(meterField)]);
			var measureNum = parseInt((audio.currentTime / secondsPerBar).toString());
			var barNum = getBarNumFromMeasure(measureNum);
			highlightBar(barNum);
		}
	}
}

function getBarNumFromMeasure(measureNum) {
	var intro = Number(range.values[currentRow][range.values[0].indexOf('Intro')]);
	var totalRepeats = parseInt(range.values[currentRow][range.values[0].indexOf('Repeats')]);
	var a = Number(range.values[currentRow][range.values[0].indexOf('A')]);
	var r = Number(range.values[currentRow][range.values[0].indexOf('A Repeat')]);
	var b = Number(range.values[currentRow][range.values[0].indexOf('B')]);
	var lead = (a * r) + b;
	var coda = Number(range.values[currentRow][range.values[0].indexOf('Coda')]);
	var currentRepeat = 0;
	var currentBar = 0;

	if (measureNum < intro) {
		currentRepeat = 0;
		currentBar = measureNum;
	} else if (measureNum < (intro + lead)) {
		currentRepeat = 1;
		currentBar = measureNum;
	} else if (measureNum < (intro + (lead * (totalRepeats - 1)))) {
		currentRepeat = 1 + parseInt(((measureNum - intro) / lead).toString());
		currentBar = measureNum - ((currentRepeat - 1) * lead);
	} else if (measureNum < (intro + (lead * (totalRepeats)) + coda)) {
		currentRepeat = totalRepeats;
		currentBar = measureNum - ((currentRepeat - 1) * lead);
	} else {
		currentRepeat = totalRepeats;
		currentBar = measureNum - (((currentRepeat - 1) * lead) - (lead + coda));
	}

	repeatsDiv.textContent = 'Repeats: ' + currentRepeat + ' / ' + totalRepeats;
	return currentBar;
}

function highlightBar(barNum) {
	var meter = range.values[currentRow][range.values[0].indexOf(meterField)];
	for (var i = 0; i < cTable.length; i++) {
		if ((i / meter) >= barNum && (i / meter) < (barNum + 1)) {
			cTable[i].style.backgroundColor = 'yellow';
		} else {
			cTable[i].style.backgroundColor = '';
		}
	}
}

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

function gotoThisSong(e) {
	currentRow = e.innerHTML;
	loadNext();
	// audio.play();
}

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
	cTable = document.getElementById('changesContainer');
	cTable = cTable.getElementsByTagName('td');
}

function buildChangesTable() {
	var tbl = '';
	var iChanges = getChanges(introChangesFldName);
	var aChanges = getChanges(changesFldName);
	var cChanges = getChanges(codaChangesFldName);
	tbl = '<table>' + iChanges + aChanges + cChanges + '</table>';
	return tbl;
}

function getChanges(fldName, cntFldName) {
	var changes = range.values[currentRow][range.values[0].indexOf(fldName)];
	if (changes) {
		var changesAry = changes.split(',');
		changes = '';
		var meter = range.values[currentRow][range.values[0].indexOf(meterField)];
		for (var i = 0; i < changesAry.length; i++) {
			var style = '';
			var newRow = '';
			if (i % meter == 0) {
				if (i == 0 || changesAry[i].substr(0,1) == '|') {
					style += 'border-left:4px double;';
					if (changesAry[i].substr(0,1) == '|') {
						changesAry[i] = changesAry[i].substr(1,changesAry[i].length - 1);
					}
				} else {
					style += 'border-left:1px solid;';
				}
			}
			if (((i + 1) % meter) == 0) {
				if ((changesAry[i].substr(0,1) == '|') || ((i + 1) == changesAry.length)) {
					style += 'border-right:4px double;';
					if ((i + 1) % (4 * meter) == 0) {
						newRow += '</tr><tr>';
					}
					if (changesAry[i].substr(0,1) == '|') {
						changesAry[i] = changesAry[i].substr(1,changesAry[i].length - 1);
					}
				} else {
					style += 'border-right:1px solid;';
					if ((i + 1) % (4 * meter) == 0) {
						newRow += '</tr><tr>';
					}
				}
			}
			if (style != '') {
				style = ' style="' + style + '"';
			}
			changes += '<td' + style + '>' + ((changesAry[i]) ? changesAry[i] : '&nbsp') + '</td>' + newRow;
		}
		return '<tr>' + changes + '</tr>';
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
