const expect = require("chai").expect;
const request = require("supertest");
const Mockgoose = require("mockgoose").Mockgoose;


var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	User = require("../../models/user"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	expressSession = require("express-session"),
	flash = require('connect-flash');

var indexRouter = require("../../routes/index"),
	listingRouter = require("../../routes/listings"),
	commentRouter = require("../../routes/comments"),
	authRouter = require("../../routes/auth");
	searchRouter = require("../../routes/search");

// pass a variable named moment to all of our view files
// app.locals.moment = require("moment");

app.use(bodyParser.json());
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
//mongoose.connect("mongodb://localhost/true_stay");
// connect to mock database
const mockgoose = new Mockgoose(mongoose);

app.use("/",indexRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/comment",commentRouter);
app.use("/",authRouter);
app.use("/search",searchRouter);


describe("POST /register", () => {

    before((done) => {
        mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect("mongodb://localhost/true_stay");
            done();
        })
        .catch((err) => done(err));
    })

    after((done) => {
        mongoose.disconnect()
        .then(() => done())
        .catch((err) => done(err));
    })

    it("OK :: successfully registered a new user", (done) => {
        request(app).post("/register")
        .send({username: "testTenant", password: 'testpass', userType:"tenant"})
        .then((res) => {
            const body = res.body;
            expect(302);
            done();
        })
        .catch((err) => done(err));
    })

})

describe("POST /login", () => {

    before((done) => {
        mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect("mongodb://localhost/true_stay");
            done();
        })
        .catch((err) => done(err));
    })

    after((done) => {
        mongoose.disconnect()
        .then(() => done())
        .catch((err) => done(err));
    })

    it("OK :: successfully logged in", (done) => {
        request(app).post("/login")
        .send({username: "testTenant", password: 'testpass'})
        .then((res) => {
            const body = res.body;
            expect(302);
            done();
        })
        .catch((err) => done(err));
    })

})