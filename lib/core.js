function button_generate_click() {
	$("li #printTab").click();
	generateBlankTable();
	populateTable();
}

function generateBlankTable() {
	var rowCounter = 0;
	var colCounter = 0;
	var rowLimit = 24;
	var colLimit = 8;
	var cellCounter = 0;
	for (rowCounter = 0; rowCounter < rowLimit; rowCounter++) {
		var rowId = 'row' + rowCounter;
		$('#printTable').before('<tr id="' + rowId + '"></tr>');
		for (colCounter = 0; colCounter < colLimit; colCounter++) {
			var colId = rowId + 'col' + colCounter;
			var cellId = 'cell' + cellCounter++;
			$('#' + rowId).append('<td id="' + colId + '"><div id="' + cellId + '"></div></td>');
		}
	}
}

function populateTable() {
	var i = 12345678;
	for (var printCounter = 0; printCounter < 112; printCounter++) {
		var cellId = 'cell' + printCounter;
		$('#' + cellId).barcode((i+=123) + '', 'int25');
		$('#' + cellId).prepend('insert name here');
	}
}

function populateManualEntryFields(_rowId, _barcodeId, _itemNameId, _amountId) {
	$('#manualEntryFooter').before('<tr>' 
								+ '<td><input type="text" size=8 id="' + _barcodeId + '" /></td>'
								+ '<td><input type="text" size=16 id="' + _itemNameId + '" /></td>'
								+ '<td><input type="text" size=2 id="' + _amountId + '" value="1"/></td>'
								+ '</tr>');
}

function loopManualEntry(_repeat, _manualEntryRow) {
	for (var repeatCount = 0; repeatCount < _repeat; repeatCount++) {
		var rowId = "mef" + _manualEntryRow;
		var barcodeId = "bid" + _manualEntryRow;
		var itemNameId = "inid" + _manualEntryRow;
		var amountId = "aid" + _manualEntryRow;
		_manualEntryRow++;
		populateManualEntryFields(rowId, barcodeId, itemNameId, amountId)
	}
	return _manualEntryRow;
}

function init() {
	var manualEntryRow = loopManualEntry(3, 0);
	$('#manualEntryRowCount').text(manualEntryRow);
}

function addMoreManualEntryRow() {
	var manualEntryRow = $('#manualEntryRowCount').text();
	manualEntryRow = loopManualEntry(1, manualEntryRow);
	$('#manualEntryRowCount').text(manualEntryRow);
	
	var currentHeight = parseInt($("#manualEntryHeader").css('height').replace('px', '')) + 24;
	$('#manualEntryHeader').parent().css('height', currentHeight + 'px');
}
