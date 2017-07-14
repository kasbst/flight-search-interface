/* 
* Generate flights table and fill it with flights data 
*/
function CreateTable (table, flights) {
	for (var flight in flights.data) {
		console.log(flights.data[flight].flightNum);
		if (flights.data.hasOwnProperty(flight)) {
			var startdate = new Date(flights.data[flight].start.dateTime).toLocaleString().replace(/(.*)\D\d+/, '$1');
			var enddate = new Date(flights.data[flight].finish.dateTime).toLocaleString().replace(/(.*)\D\d+/, '$1');
							
			var row = $('<tr></tr>').addClass('clickable-row').attr('id',flights.data[flight].flightNum);
			var cell = $('<td></td>').text(flights.data[flight].airline.name);
			row.append(cell);
			var cell = $('<td></td>').text(flights.data[flight].start.cityName);
			row.append(cell);
			var cell = $('<td></td>').text(flights.data[flight].finish.cityName);
			row.append(cell);
			var cell = $('<td></td>').text(startdate);
			row.append(cell);
			var cell = $('<td></td>').text(enddate);
			row.append(cell);
			var cell = $('<td></td>').text('$' + flights.data[flight].price);
			row.append(cell);
			table.append(row);
		}
	} 
};

/* 
* Initialize departures table 
*/
function InitializeDeparturesTable () {
	$('#DeparturesTablePlaceholder').empty();
	var table = $('<table><tr><th>Flight No.</th><th>Start</th><th>Dest</th><th>Dep.Date</th>'+
	'<th>Arr. Date</th><th>Price</th></tr></table>').addClass('table table-striped DataTable').attr('id', "DeparturesTable");
	
	return table;
};

/*
* Initialize returns table
*/
function InitializeReturnsTable () {
	$('#ReturnsTablePlaceholder').empty();
	var table = $('<table><tr><th>Flight No.</th><th>Start</th><th>Dest</th><th>Dep.Date</th>'+
	'<th>Arr. Date</th><th>Price</th></tr></table>').addClass('table table-striped DataTable').attr('id', "ReturnsTable");;
	
	return table;
};