var express = require('express');
var request = require('request');
var moment  = require('moment');
var router = express.Router();

/* GET the available flights based on supplied arguments */
router.post('/:airline_code', function(req, res) {
	var date = moment(req.body.date, 'MM/DD/YYYY').format('YYYY-MM-DD');
	var from_airport_code = req.body.from_airport_code;
	var to_airport_code = req.body.to_airport_code;
	
	var url = 'http://node.locomote.com/code-task/flight_search/' + req.params.airline_code + '?date=' + date + '&from=' + from_airport_code + '&to=' + to_airport_code;
	GetFlights(url, function(return_value) {
		var flight = return_value;
		res.send(flight);
	});		
});

function GetFlights (url, callback) {
	var flights = {
		statusCode: 0,
		data: ""
	};
	request(url, function (err, response, body) {
		
    	if (err || response.statusCode !== 200) {
			flights.statusCode = 500;
    	} else {
    		flights.statusCode = 200;
			flights.data = JSON.parse(body);			
    	}
		callback(flights);
	});
}

module.exports = router;