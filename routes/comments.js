var express = require("express"),
	router = express.Router({mergeParams: true}),
	Listing = require("../models/listing"),
	Comment = require("../models/comment"),
	middleware = require("../middlewares");

// new 
router.get("/new", middleware.isLoggedIn, function(req, res){
	Listing.findById(req.params.id, function(err, listing){
		if (err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings/"+ camp._id);
		} else{
			res.render("comment/new", {listing: listing});
		}
	})
});
// create comment 
router.post("/",middleware.isLoggedIn, function(req, res){
	Listing.findById(req.params.id, function(err, listing){
		if (err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings/"+ listing._id);
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					listing.comments.push(comment);
					listing.save();
					req.flash("success", "Successfully created comment!");
					res.redirect("/listings/"+ listing._id);
				}
			});
		}
	});
});
// Edit
router.get("/:comment_id/edit",middleware.isLoggedIn,middleware.checkCommentOwnership, function(req,res){
	Listing.findById(req.params.comment_id, function(err, comment){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings/"+ req.params.id);
		} else{
			res.render("comment/edit", {listing_id: req.params.id, comment: comment});	
		}
	});
});
// update
router.put("/:comment_id",middleware.isLoggedIn,middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
		if(err){
			console.log(err);
			res.flash("error", "Something went wrong, Please contact your admin!");
			res.redirect("/listings/"+ req.params.id);
		} else{
			req.flash("success", "Successfully updated comment!");
			res.redirect("/listings/"+req.params.id);
		}
	});
});
// delete
router.delete("/:comment_id",middleware.isLoggedIn,middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id, function(err){
		if (err){
			console.log(err);
			res.redirect("/listings/"+req.params.id);
		} else{
			req.flash("success", "Successfully deleted comment!");
			res.redirect("/listings/"+req.params.id);
		}
	})
})


module.exports = router;