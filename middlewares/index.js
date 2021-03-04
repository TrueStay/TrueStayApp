var Listing = require("../models/listing"),
	Comment = require("../models/comment");
	User = require("../models/user");
var middlewareObj = {}

middlewareObj.checkListingOwnership = function(req,res,next){
	Listing.findById(req.params.id, function(err, foundListing){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("back");
		} else{
			if(foundListing.author.id.equals(req.user._id) || req.user.isAdmin){
				next();
			} else{
				req.flash("error", "You don't have permission to do that!");
				res.redirect("back");
			}
		}
	});
};
middlewareObj.checkIsLandlord = function(req, res, next){
	User.findById(req.user._id, function(err, foundUser){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact you admin!");
			res.redirect("back");
		} else {
			console.log(foundUser.userType);
			if(foundUser.userType == "landLord" || req.user.isAdmin){
				next();
			} else {
				req.flash("error", "Your account type is not landlord. If you want to post listings, please register as a landlord.");
				res.redirect("back");
			}
		}
	});
};


middlewareObj.checkCommentOwnership = function(req,res,next){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("back");
		} else{
			if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
				next();
			} else{
				req.flash("error", "You don't have permission to do that!");
				res.redirect("back");
			}
		}
	});
};

middlewareObj.isLoggedIn = function(req,res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to login to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;