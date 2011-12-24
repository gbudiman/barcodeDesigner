function button_generate_click(_arg) {
	$("li #printTab").click();
	$("#noDataInfo").remove();
	generateBlankTable();
	if (_arg == "batch") {
		parseBatch();
	}
	else {
		populateTable();
	}
}

function simulateTabClick(_target) {
	$("li " + _target).click();
}

function generateBlankTable() {
	$('#printTable').empty();
	var rowCounter = 0;
	var colCounter = 0;
	var rowLimit = $('#rowSize').val();
	var colLimit = $('#colSize').val();
	var cellCounter = 0;
	for (rowCounter = 0; rowCounter < rowLimit; rowCounter++) {
		var rowId = 'row' + rowCounter;
		$('#printTable').append('<tr id="' + rowId + '"></tr>');
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
	var skipCells = $('#skipCells').val();
	cellCounter = barcodeEmptyCell(cellCounter, skipCells);
	for (var printCounter = 0; printCounter < listCount; printCounter++) {
		var barcode = $('#bid' + printCounter).val();
		if (barcode.length != 0) {
			var textData = $('#inid' + printCounter).val();
			if (textData.length == 0) 
				textData = $('#replaceNull').val();
			var repeatCount = $('#aid' + printCounter).val();
			cellCounter = barcodeFillCell(cellCounter, barcode, textData, repeatCount);
		}
	}
}

function parseBatch() {
	var cellCounter = 0;
	var rawBatch = $('#batchArea').val();
	var line = rawBatch.split('\n');
	for (var lineCounter = 0; lineCounter < line.length; lineCounter++) {
		var cell = line[lineCounter].split('\t');
		if (cell.length > 1) {
			cell[0] = cell[0].replace(/[ ]/gi, '');
			if (cell[2] !== undefined) {
				if (cell[2].length == 0) {
					cell[2] = 1;
				}
				else {
					cell[2] = cell[2].replace(/[ ]/gi, '');
				}
			}
			else {
				cell[2] = 1;
			}
			if (cell[0].length == 0) {
				cellCounter = barcodeEmptyCell(cellCounter, cell[2]);
			}
			else {
				cellCounter = barcodeFillCell(cellCounter, cell[0], cell[1], cell[2]);
			}
		}
	}
}

function barcodeEmptyCell(_id, _repeat) {
	for (var i = 0; i < _repeat; i++) {
		var cellId = 'cell' + _id++;
		$('#' + cellId).barcode({
			code: '00000000',
			crc: false
		}, 'int25', {
			barHeight: 42,
			showHRI: false,
			color: 'white',
		})
		$('#' + cellId).prepend('<div style="width:100%"><span class="hidden">skipped</span></div>');
		$('#' + cellId).append('<span class="hidden">skipped</span>');
	}
	
	return _id;
}

function barcodeFillCell(_id, _barcode, _label, _repeat) {
	var hriData = _barcode.substr(0, 2) + ' '
				+ _barcode.substr(2, 1) + ' '
				+ _barcode.substr(3, 1) + ' '
				+ _barcode.substr(4, 4);
	if (_label.length == 0) {
		_label = "<span class='hidden'>hidden</span>";
	}
	for (var i = 0; i < _repeat; i++) {
		var cellId = 'cell' + _id++;
		$('#' + cellId).barcode({
			code: _barcode + '',
			crc: false
		}, 'int25', {
			barHeight: 42,
			showHRI: false
		});
		$('#' + cellId).prepend('<div style="width:100%">' + _label + '</div>');
		$('#' + cellId).append(hriData);
	}
	
	return _id;
}

function populateManualEntryFields(_rowId, _barcodeId, _itemNameId, _amountId) {
	$('#manualEntryFooter').before('<tr>' 
								+ '<td><input onkeypress="return handleInput(this, event)" type="text" size=8 id="' + _barcodeId + '" /></td>'
								+ '<td><input onkeypress="return handleEnter(this, event)" type="text" size=16 id="' + _itemNameId + '" /></td>'
								+ '<td><input onkeypress="return handleEnter(this, event)" onfocus="$(this).select()" type="text" size=2 id="' + _amountId + '" value="1"/></td>'
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
	var preloadEntry = 12;
	var manualEntryRow = loopManualEntry(preloadEntry, 0);
	$('#bid0').focus();
	$('#manualEntryRowCount').text(preloadEntry);
	$('#skipCells').val('0');
	$('#replaceNull').val('Coan Yogya');
	$('#rowSize').val(24);
	$('#colSize').val(7);
	//$('#accordion').accordion({autoHeight: false});
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

function handleEnter (field, event) {
	var inputs = $(':input').keypress(function(event){ 
	    if (event.which == 13) {
	       event.preventDefault();
	       var nextInput = inputs.get(inputs.index(field) + 1);
	       if (nextInput) {
	          nextInput.focus();
	       }
	    }
	});
}      

function handleInput (field, event) {
	handleEnter(field, event);
	if ($(field).val().length == 7) {
		var nextInput = $(':input').get($(':input').index(field) + 1);
		if (nextInput) {
		  nextInput.focus();
		}
	}
}
