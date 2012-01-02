function button_generate_click(_arg) {
	$('#divSettings').dialog("open");
	$("li #printTab").click();
	$("#noDataInfo").remove();
	generateBlankTable();
	document.inputMethod = _arg;
	if (_arg == "batch") {
		parseBatch();
		$('#interactiveButton').replaceWith('<button class="ui-state-default ui-corner-all big-button" id="interactiveButton"'
											+ 'onclick="layoutChange()" '
											+ 'onmouseover="$(this).removeClass(\'ui-state-default\'); $(this).addClass(\'ui-state-hover\');"'
											+ 'onmouseout="$(this).removeClass(\'ui-state-hover\'); $(this).addClass(\'ui-state-default\');">Adjust layout</button>');
	}
	else {
		populateTable();
		$('#interactiveButton').replaceWith('<button class="ui-state-default ui-corner-all big-button" id="interactiveButton"'
									+ 'onclick="layoutChange()" '
									+ 'onmouseover="$(this).removeClass(\'ui-state-default\'); $(this).addClass(\'ui-state-hover\');"'
									+ 'onmouseout="$(this).removeClass(\'ui-state-hover\'); $(this).addClass(\'ui-state-default\');">Adjust layout</button>');
	}
	$('#progressbarWrapper').hide('drop', 'slow');
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
			$('#' + rowId).append('<td id="' + colId + '" width="' + $('#cellSize').val() + 'px">' 
								+ '<div class="barcodeCell" id="' + cellId + '"></div></td>');
		}
	}
}

function populateTable() {
	var listCount = $('#manualEntryRowCount').text();
	var cellCounter = 0;
	var skipCells = $('#skipCells').val();
	cellCounter = barcodeEmptyCell(cellCounter, skipCells);
	var barcodeArray = document.getElementsByName("bid");
	var labelTextArray = document.getElementsByName("inid");
	var amountArray = document.getElementsByName("aid");
	var totalWork = 0;
	for (var i in barcodeArray) {
		if (barcodeArray[i].value.replace(" ", '').length != 0) {
			totalWork += parseInt(amountArray[i].value, 10);
		}
	}
	document.progressbarMax = totalWork;
	for (var i in barcodeArray) {
		var barcode = barcodeArray[i].value.replace(" ", '');
		if (barcode.length != 0) {
			var textData = labelTextArray[i].value;
			if (textData.length == 0) 
				textData = $('#replaceNull').val();
			var repeatCount = amountArray[i].value;
			cellCounter = barcodeFillCell(cellCounter, barcode, textData, repeatCount);
		}
	}
}

function parseBatch() {
	var cellCounter = 0;
	var rawBatch = $('#batchArea').val();
	var line = rawBatch.split('\n');
	var totalWork = 0;
	for (var lineCounter = 0; lineCounter < line.length; lineCounter++) {
		var cell = line[lineCounter].split('\t');
		if (cell[2] !== undefined) {
			totalWork += parseInt(cell[2], 10);
		}	
		else {
			totalWork++;
		}
	}
	document.progressbarMax = totalWork;
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
		$('#progressbar').progressbar("option", "value", (++document.currentProgress * 100 / document.progressbarMax));
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
		//alert(document.currentProgress / document.progressbarMax);
		$('#progressbar').progressbar("option", "value", (++document.currentProgress * 100 / document.progressbarMax));
	}
	
	return _id;
}

function populateManualEntryFields(_barcodeId, _itemNameId, _amountId) {
	$('#manualEntryFooter').before('<tr class="rowSortable">' 
								+ '<td class="ui-state-default" '
									+ 'onclick="$(this).parent().fadeOut(\'fast\', function() {$(this).remove(); adjustManualEntryTable()});" '
									+ 'onmouseover="$(this).addClass(\'ui-state-hover\'); $(this).removeClass(\'ui-state-default\');" '
									+ 'onmouseout="$(this).addClass(\'ui-state-default\'); $(this).removeClass(\'ui-state-hover\');" '
									+ '><span class="ui-icon ui-icon-closethick"></span></td>'
								+ '<td class="ui-state-default" '
									+ 'onmouseover="$(this).addClass(\'ui-state-hover\'); $(this).removeClass(\'ui-state-default\');" '
									+ 'onmouseout="$(this).addClass(\'ui-state-default\'); $(this).removeClass(\'ui-state-hover\');" '
									+ '><span class="ui-icon ui-icon-arrowthick-2-n-s"></span></td>'
								+ '<td><input onkeypress="return handleInput(this, event)" type="text" size=8 name="' + _barcodeId + '" /></td>'
								+ '<td><input onkeypress="return handleEnter(this, event)" type="text" size=16 name="' + _itemNameId + '" /></td>'
								+ '<td><input onkeypress="return handleEnter(this, event)" onfocus="$(this).select()" type="text" size=2 name="' + _amountId + '" value="1"/></td>'
								+ '</tr>');
}

function loopManualEntry(_repeat) {
	for (var repeatCount = 0; repeatCount < _repeat; repeatCount++) {
		populateManualEntryFields("bid", "inid", "aid");
	}
}

function init() {
	var preloadEntry = 12;
	loopManualEntry(preloadEntry, 0);
	$('#skipCells').val('0');
	$('#replaceNull').val('Coan Yogya');
	$('#rowSize').val(24);
	$('#rowSlider').slider({value: 24});
	$('#colSize').val(7);
	$('#colSlider').slider({value: 7});
	$('#cellSize').val(64);
	$('#cellSlider').slider({value: 64});
	$('#progressbarWrapper').hide();
	$('#divSettings').dialog("open");
}

function addMoreManualEntryRow() {
	var manualEntryRow = $('#manualEntryRowCount').text();
	manualEntryRow = loopManualEntry(1, manualEntryRow);
	
	var currentHeight = parseInt($("#manualEntryHeader").css('height').replace('px', '')) + 24;
	$('#manualEntryHeader').parent().css('height', currentHeight + 'px');
}

function adjustManualEntryTable() {
	//var currentHeight = parseInt($("#manualEntryHeader").css('height').replace('px', ''));
	//$('#manualEntryHeader').parent().css('height', currentHeight + 'px');
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

function layoutChange() {
	$("#rowSlider").slider("option", "value", $("#rowSize").val());
	$("#colSlider").slider("option", "value", $("#colSize").val());
	$("#cellSlider").slider("option", "value", $("#cellSize").val());
	button_generate_click(document.inputMethod);
}

