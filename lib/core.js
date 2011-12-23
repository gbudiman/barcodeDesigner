function button_generate_click() {
	$("li #printTab").click();
	generateBlankTable();
}

function generateBlankTable() {
	var rowCounter = 0;
	var colCounter = 0;
	var rowLimit = 8;
	var colLimit = 24;
	for (rowCounter = 0; rowCounter < rowLimit; rowCounter++) {
		var rowId = 'row' + rowCounter;
		$('#printTable').before('<tr id="' + rowId + '"></tr>');
	}
}
