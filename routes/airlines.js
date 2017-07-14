var express = require('express');
var request = require('request');
var router = express.Router();

/* GET list of available airlines */
router.get('/', function(req, res) {
	request('http://node.locomote.com/code-task/airlines', function (err, response, body) {
	    if (err || response.statusCode !== 200) {
	      return res.sendStatus(500);
	    }
		var data = JSON.parse(body);
		var airlines = [];
		for (var key in data) {		
			if (data.hasOwnProperty(key)) {
				airlines.push(data[key].code);
			}
		}
	    res.send(airlines);
	  });
});

module.exports = router;