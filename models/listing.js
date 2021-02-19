var mongoose = require("mongoose");

var listingSchema = new mongoose.Schema({
	title: String,
	price: String,
	image: String,
	desc: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});


module.exports = mongoose.model("Listing", listingSchema);