var express = require('express');
var request = require('request');
var router = express.Router();

/* Render page with available airlines */
router.get('/', function(req, res) {
	request('http://node.locomote.com/code-task/airlines', function (err, response, body) {
	    if (err || response.statusCode !== 200) {
	      return res.sendStatus(500);
	    }
	    res.render('list_airlines', { airlines : JSON.parse(body) });
	  });
});

module.exports = router;