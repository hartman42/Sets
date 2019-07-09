var f = function(measureNum) {
    var intro = 2;
    var lead = 4;
    var coda = -2;
    var totalRepeats = 3;
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

    return currentRepeat + ', ' + currentBar;
}
