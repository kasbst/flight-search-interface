var express = require('express');
var request = require('request');
var router = express.Router();

/* GET list of available airports based on searched cityName string.
*  The result of API request is sent via AJAX to the autocomplete form.
*/
router.get('/:city', function(req, res) {
	request("http://node.locomote.com/code-task/airports?q=" + req.params.city, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return res.sendStatus(500);
    }
	
	var data = JSON.parse(body);
    res.send(data);
  });
	
});

module.exports = router;