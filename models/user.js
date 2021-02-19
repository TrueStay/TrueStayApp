var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {
		type: Boolean,
		default: false
	},
	firstName: String,
	lastName: String,
	email: String,
	DoB: Date,
	userType: String,
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);