var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	expressSession = require("express-session"),
	flash = require('connect-flash');

var indexRouter = require("./routes/index"),
	listingRouter = require("./routes/listings"),
	commentRouter = require("./routes/comments"),
	authRouter = require("./routes/auth");
	searchRouter = require("./routes/search");

// pass a variable named moment to all of our view files
// app.locals.moment = require("moment");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport and express session configuration
app.use(expressSession({
	secret: "TrueStayApplicationSecret@123",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

//Add middleware to pass variables to all view files
app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.moment = require("moment"); // works same way with app.locals.moment = require("moment");
	next();
})
// resolve all deprication warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// connect to database
mongoose.connect("mongodb://localhost/true_stay");

app.use("/",indexRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/comment",commentRouter);
app.use("/",authRouter);
app.use("/search",searchRouter);

app.listen(8000, function(){
	console.log("TrueStay server has started at http://localhost:8000");
});