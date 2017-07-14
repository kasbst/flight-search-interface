/*
* Generate bootstrap modal with flight details for each table row.
* I found that flight numbers are not unique, so we need to use unique
* id=modal_type + flight_number for each modal as well.
*/
function CreateModal (flights, modal_type, modal_type_placeholder_id) {
	for (var flight in flights.data) {
		if (flights.data.hasOwnProperty(flight)) {
			var startdate = new Date(flights.data[flight].start.dateTime).toLocaleString().replace(/(.*)\D\d+/, '$1');
			var enddate = new Date(flights.data[flight].finish.dateTime).toLocaleString().replace(/(.*)\D\d+/, '$1');
						
			var modal = ('<div class="modal fade" id="' + modal_type + '-' + flights.data[flight].flightNum + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
			  '<div class="modal-dialog modal-lg" role="document">' +
			    '<div class="modal-content">' +
			       '<div class="modal-header">' +
			         '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
			         '<h4 class="modal-title" id="myModalLabel">' + flights.data[flight].airline.name + ' - flight no. ' + flights.data[flight].flightNum + '</h4>' +
			       '</div>' +
			       '<div class="modal-body">' +
			         '<div class="container-fluid text-center">' +
			  		   '<div class="row">' +
			  		     '<div class="col-sm-6">' +
							'<h4> Departure details </h4>' +
							'<p> Airline: ' + flights.data[flight].airline.name + '</p>' +
							'<p> Flight Number: ' + flights.data[flight].flightNum + '</p>' +
							'<p> Airport Name: ' + flights.data[flight].start.airportName + '</p>' +
							'<p> City Name: ' + flights.data[flight].start.cityName + '</p>' +
							'<p> Country Name: ' + flights.data[flight].start.countryName + '</p>' +
							'<p> Departure time: ' + startdate + '</p>' +
						 '</div>' +
						 '<div class="col-sm-6">' +
							'<h4> Arrival details </h4>' +
							'<p> Airline: ' + flights.data[flight].airline.name + '</p>' +
							'<p> Flight Number: ' + flights.data[flight].flightNum + '</p>' +
							'<p> Airport Name: ' + flights.data[flight].finish.airportName + '</p>' +
							'<p> City Name: ' + flights.data[flight].finish.cityName + ' </p>' +
							'<p> Country Name: ' + flights.data[flight].finish.countryName + '</p>' +
							'<p> Arrival time: ' + enddate + '</p>' +
						 '</div>' +
					 '</div>' +
					 '<br>' +
					 '<div class="row">' +
						 '<div class="col-sm-12">' +
							 '<h4> Airplane </h4>' +
							 '<p> Name: ' + flights.data[flight].plane.fullName + '</p>' +
							 '<p> Manufacturer: ' + flights.data[flight].plane.manufacturer + '</p>' +
							 '<p> Model: ' + flights.data[flight].plane.model + '</p>' +
							 '</br>' +
							 '<h4> Journey Info </h4>' +
							 '<p> Distance (km): ' + flights.data[flight].distance + '</p>' +
							 '<p> Duration (min): ' + flights.data[flight].durationMin + '</p>' +
							 '</br>' +
							 '<h4> Total price </h4>' +
							 '<h4> $' + flights.data[flight].price + '</h4>' +
						 '</div>' +
					 '</div>' +
					 '</div>' +
			       '</div>' +
			       '<div class="modal-footer">' +
			         '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
			       '</div>' +
			     '</div>' +
			   '</div>' +
			 '</div>');
		  
		  $(modal_type_placeholder_id).append(modal);
	   }
    }
};