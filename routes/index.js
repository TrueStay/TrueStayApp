express = require("express");
router = express.Router();
// Home page
router.get("/", function(req,res){
	res.render("index");
});

module.exports = router;