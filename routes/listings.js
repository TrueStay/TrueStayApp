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
			res.render("listing/index", {listings: allListings, page: "listings"});
		}
	});
});

// filter listings route
router.post("/filter", function(req,res){
	var where = {};
	switch(req.body.filterOption){
		case "0-400":
			where.price = { $gt : 0, $lt: 399};
			break;
		case "400-600":
			where.price = { $gt : 400, $lt: 599};
			break;
		case "600-800":
			where.price = { $gt : 600, $lt: 799};
			break;
		case "800-1000":
			where.price = { $gt : 800, $lt: 999};
			break;
		case "1000-*":
			where.price = { $gt : 1000};
			break;		
	}
	var sort = {};
	if(req.body.sortBy == "desc"){
		sort.sort = {'price': -1};
	} else if (req.body.sortBy == "asc") {
		sort.sort = {'price': 1};
	} else {
		sort.sort = {'createdAt': 1};
	}
	Listing.find(where,null, sort, function(err, allListings){
		if(err){
			res.flash("error", "Something went wrong, Please contact your admin!");
			console.log(err);
		}else{
			res.render("listing/index", {listings: allListings, page: "listings"});
		}
	});
});

// create route - to post create request
router.post("/",middleware.isLoggedIn, function(req,res){
	var title = req.body.title,
		price = req.body.price,
		image = req.body.image,
		desc = req.body.desc,
		author = {
			id: req.user._id,
			username: req.user.username
		}
	geocoder.geocode(req.body.location, function (err, data) {
	    if (err || !data.length) {
	    	console.log(err);
	    	req.flash('error', 'Invalid address');
	    	return res.redirect('back');
	    }
	    var lat = data[0].latitude;
	    var lng = data[0].longitude;
	    var location = data[0].formattedAddress;
	    var newListing = {title: title, image: image, desc: desc,price: price, author:author, location: location, lat: lat, lng: lng};
		Listing.create(newListing, function(err, newListing){
			if(err){
				res.flash("error", "Something went wrong, Please contact your admin!");
				console.log(err);
				res.redirect("/listings");
			} else{
				req.flash("success", "Successfully created listing");
				res.redirect("/listings");		
			}
		});
	});
});

// new route - to show create form
router.get("/new",middleware.isLoggedIn, middleware.checkIsLandlord, function(req,res){
	res.render("listing/new");
});

// show route - to show detail
router.get("/:id", function(req,res){
	Listing.findById(req.params.id).populate("comments").exec(function(err, foundListing){
		if (err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings");
		} else{
			res.render("listing/show",{listing: foundListing, apiKey: process.env.GEOCODER_API_KEY_2});
		}
	});
});
// edit - show edit form
router.get("/:id/edit",middleware.isLoggedIn,middleware.checkListingOwnership, function(req,res){
	Listing.findById(req.params.id, function(err, foundListing){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings");
		}else{
			res.render("./listing/edit", {listing: foundListing});
		}
	});
});

// update - send Put request
router.put("/:id",middleware.isLoggedIn,middleware.checkListingOwnership, function(req,res){
	geocoder.geocode(req.body.listing.location, function (err, data) {
	    if (err || !data.length) {
	    	console.log(err);
	    	req.flash('error', 'Invalid address');
	    	return res.redirect('back');
	    }
	    req.body.listing.lat = data[0].latitude;
	    req.body.listing.lng = data[0].longitude;
	    req.body.listing.location = data[0].formattedAddress;
		Listing.findByIdAndUpdate(req.params.id, req.body.listing, function(err, listing){
			if(err){
				console.log(err);
				res.flash("error", "Something went wrong, Please contact your admin!");
				res.redirect("/listings");
			} else{
				req.flash("success", "Successfully updated campground!");
				res.redirect("/listings/"+req.params.id);
			}
		});
	});
});


// delete
router.delete("/:id",middleware.isLoggedIn,middleware.checkListingOwnership, function(req,res){
	Listing.findByIdAndDelete(req.params.id, function(err){
		if (err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings");
		} else{
			req.flash("success", "Successfully deleted campground!");
			res.redirect("/listings");
		}
	});
});


module.exports = router;