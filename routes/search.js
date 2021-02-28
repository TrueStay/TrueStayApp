require('dotenv').config();
var express = require("express"),
	router = express.Router(),
    Listing = require("../models/listing"),
	middleware = require("../middlewares"); // it'll automatically look for index.js file
var NodeGeocoder = require('node-geocoder');

 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// index route
router.get("/", function(req,res){
    Listing.find({}, function(err, allListings){
		if(err){
			res.flash("error", "Something went wrong, Please contact your admin!");
			console.log(err);
		}else{
            var address = {
                lat: 100,
                lng: -100,
            }
			res.render("search",{
                listings: allListings, 
                reType: "get",
                page: "search", 
                address: address,
                apiKey: process.env.GEOCODER_API_KEY_2});
		}
	});
	
});
// index route
router.post("/", function(req,res){
    Listing.find({}, function(err, allListings){
        geocoder.geocode(req.body.location, function (err, data) {
            if (err || !data.length) {
                console.log(err);
                req.flash('error', 'Invalid address');
                return res.redirect('back');
            }
            var lat = data[0].latitude;
            var lng = data[0].longitude;
            var location = data[0].formattedAddress;
            var address = {
                lat: lat,
                lng: lng,
                location: location
            }
            res.render("search",{
                listings: allListings, 
                page: "search", 
                reType: "post",
                address: address,
                apiKey: process.env.GEOCODER_API_KEY_2});
        });
	});
	
});
module.exports = router;