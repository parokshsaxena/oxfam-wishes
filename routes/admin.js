var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
	res.render('admin', { title : 'Oxfam-Admin', layout : 'admin'});
});

module.exports = router