var express = require("express"),
	router = express.Router(),
	User = require("../models/user"),
	passport = require("passport");

// Register
router.get("/register", function(req,res){
	res.render("auth/register", {page: "register"});
});
router.post("/register", function(req,res){
	newUser = new User({
		username: req.body.username, 
		firstName:req.body.firstName, 
		lastName:req.body.lastName, 
		email:req.body.email,
		DoB:req.body.dob,
		userType: req.body.userType
	});
	if(req.body.adminCode === "AdminCode123"){
			newUser.isAdmin = true;
		};
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			// req.flash("error",err.message); # when we use this syntax, we have to click twice to show the message
			// so we need to pass err.message directly when render register page
			res.render("auth/register",{error: err.message});
		} else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to TrueStay, "+ user.username);
				res.redirect("/listings");	
			});
		}
	});
})
// login
router.get("/login", function(req,res){
	res.render("auth/login", {page: "login"});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/listings",
	failureRedirect: "/login",
	failureFlash : true
}), function(req,res){

});
//logout
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logout sccessfully!");
	res.redirect("listings");
});

router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		} else{
			res.render("auth/user", {user: foundUser});
		}
	});
});

module.exports = router;