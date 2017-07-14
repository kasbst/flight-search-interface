/*
* Departures and Returns form autocomplete functionality:
* 1) When typing city name, performs /airports/:city request and
*    fills autocomplete source with the current data for each field.
* 2) On select event (when input data are selected) parses origin and 
*    destination airport codes, and set them to the hidden fields which 
*    will be passed to the /search post AJAX request on form submit.
* 3) On select event (when input data are selected) performs AJAX 
*    request to get the airline codes (only when selecting destinaton "from"
*    and returns "from" fields to minimize number of requests),
*    and set them to the hidden fields, which will be passed to the
*    /search post AJAX request on form submit.   
*/
$(function() {
    $( "#DepartureFrom" ).autocomplete({
		source: function(request, response) {
			GetAirportsData(request, response);
		},
		minlength: 2,
		select: function(event, ui) {
			var code = ParseAirportCode(event, ui);
			$("#departure_from_airport_code").val(code);
			GetAirlines("DepartureForm");
		}
    });
    $( "#DepartureTo" ).autocomplete({
                source: function(request, response) {
			GetAirportsData(request, response);
		},
		minlength: 2,
		select: function(event, ui) {
			var code = ParseAirportCode(event, ui);
			$("#departure_to_airport_code").val(code);
		}
    });
    $( "#ReturnFrom" ).autocomplete({
                source: function(request, response) {
			GetAirportsData(request, response);
		},
		minlength: 2,
		select: function(event, ui) {
			var code = ParseAirportCode(event, ui);
			$("#return_from_airport_code").val(code);
			GetAirlines("ReturnForm");
		}
    });
    $( "#ReturnTo" ).autocomplete({
                source: function(request, response) {
			GetAirportsData(request, response);
		},
		minlength: 2,
		select: function(event, ui) {
			var code = ParseAirportCode(event, ui);
			$("#return_to_airport_code").val(code);
		}
    });
	
	/*
	* Get airports data for autocomplete functionality
	*/
	function GetAirportsData (request, response) {
		$.ajax( {
		   url: "airports/" + request.term,
		   dataType: "json",
		   success: function(data, textStatus, test) {
		   	  var airports = [];
		   	  for (var key in data) {		
		   		  if (data.hasOwnProperty(key)) {
		   			  airports.push(data[key].cityName + " - " + data[key].airportName + " (" + data[key].airportCode + ")");
		   		  }
		   	  }
		          response( airports );
		   },
		   complete: function (test, status) {
			   console.log(status);
		   }
	        });
	};
	
	/*
	* Parse airport code
	*/
	function ParseAirportCode(event, ui) {
		var value = ui.item.value;
		
		var regExp = /\((.*)\)/;
		var code = regExp.exec(value);
		return code[1];
	};
	
	/* 
	* Get list of airline codes
	*/
	function GetAirlines(elementId) {
		$.getJSON("/airlines", function(data) {
			if (elementId === "DepartureForm") {
				$("#departure_airlines").val(data);
			}
			if (elementId === "ReturnForm") {
				$("#return_airlines").val(data);
			}
		})
	}
});
