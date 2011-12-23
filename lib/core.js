function button_generate_click() {
	$("li #printTab").click();
	$("#noDataInfo").remove();
	generateBlankTable();
	populateTable();
}

function simulateTabClick(_target) {
	$("li " + _target).click();
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
			$('#' + rowId).append('<td id="' + colId + '"><div class="barcodeCell" id="' + cellId + '"></div></td>');
		}
	}
}

function populateTable() {
	var listCount = $('#manualEntryRowCount').text();
	var cellCounter = 0;
	for (var printCounter = 0; printCounter < listCount; printCounter++) {
		if ($('#bid' + printCounter).val().length > 0) {
			var repeatCount = $('#aid' + printCounter).val();
			var barcodeData = $('#bid' + printCounter).val();
			var hriData = barcodeData.substr(0, 2) + ' '
						+ barcodeData.substr(2, 1) + ' '
						+ barcodeData.substr(3, 1) + ' '
						+ barcodeData.substr(4, 4);
			for (var rci = 0; rci < repeatCount; rci++) {
				var cellId = 'cell' + cellCounter++;
				$('#' + cellId).barcode(barcodeData + '', 'int25', {
					barHeight: 42,
					showHRI: false
				});
				$('#' + cellId).prepend('<div style="width:100%">sample text</div>');
				$('#' + cellId).append(hriData);
			}
		}
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

function readDb() {
	/*if (typeof FileReader === "undefined") {
		$('#accordion').before('<div class="ui-widget">' 
								+ '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">'
								+ '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' 
								+ 'HTML 5 FileReader API is not supported in this browser. Automatic inventory name lookup will be disabled.<br />'
								+ '<i><b>What you can do: </b></i> Download modern browser that supports HTML 5. Try Firefox or Chrome.</p>'
								+ '</div>'
							+ '</div><br />');
		return;
	}*/
}
