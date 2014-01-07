var express       = require("express"),
    http          = require("http"),
    path          = require("path"),
    azure         = require("azure"),
    nconf         = require("nconf"),
    htp           = require("./htp/htp-foursquare"),
    foursquare    = require("node-foursquare")(htp.foursquareOptions),
    app           = express();

// Routing
var routes        = require( "./routes" ),
    api           = require( "./routes/api" );

nconf.env().file({ file: "config.json" });

var tableName     = nconf.get("TABLE_NAME"),
    partitionKey  = nconf.get("PARTITION_KEY"),
    accountName   = nconf.get("STORAGE_NAME"),
    accountKey    = nconf.get("STORAGE_KEY");

// Environment Settings
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Middleware
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.cookieSession({ key: "pid", secret: "pissr" }));
app.use(express.static(path.join( __dirname, "public" )));

/*
 * Page Routing
 * --------------------------------------------------------------- */
// Index
app.get("/", routes.index);

// Login
app.get("/login", function (req, res) {
    res.writeHead(303, { "location": foursquare.getAuthClientRedirectUrl() });
    res.end();
});

// Callback
app.get("/callback", function (req, res) {
    foursquare.getAccessToken({
        code: req.query.code
    }, function (error, accessToken) {
        if (error) {
            res.send("An error was thrown: " + error.message);
        } else {
            // Save the accessToken and redirect
            console.log("TOKEN: " + accessToken);
            console.log("CODE:  " + req.query.code);

            req.session.token = accessToken;

            res.redirect("/venues");
        }
    });
});

// Venues
app.get("/venues", function (req, res) {
    res.render("venues");
});

// Venue
app.get("/venues/:id", function (req, res) {
    http.get("http://localhost:3000/api/venues/" + req.param("id"), function (response) {
        var venueData = "";

        response.on("data", function (chunk) {
            venueData += chunk;
        });

        response.on("end", function () {
            console.log(venueData);
            res.render("venue", { v: JSON.parse(venueData) });
        });

    }).on("error", function (e) {
        console.log("error: " + e.message);
    });

    // res.render("venue", { thing: "hello" });
});

// Insert
app.get("/insert", function (req, res) {
    var tableService = azure.createTableService();

    // tableService.queryEntity("pissers", )
});

// Callback
// app.get("/test", routes.test);


/*
 * API Routing
 * --------------------------------------------------------------- */
// Venues
app.get("/api/venues", function (req, res) {

    console.log("LAT: " + req.query.lat);
    console.log("LON: " + req.query.lon);

    if (req.query && req.query.lat && req.query.lon) {
        foursquare.Venues.explore(req.query.lat, req.query.lon, { radius: 500 }, req.session.token, function (error, result) {
            res.set("Content-Type", "application/json");
            res.send(result);
        });
    } else {
        res.set("Content-Type", "application/json");
        res.send({ "error": "lat/lon not provided" });
    }
});

// Venue Details
app.get("/api/venues/:id", function (req, res) {
    var venueId = req.param("id");

    foursquare.Venues.getVenue(venueId, req.session.token, function (error, result) {
        if (error) {
            console.log("oops");
        } else {
            res.set("Content-Type", "application/json");
            res.send(result);
        }
    });
});

app.get("/api/venues/:id/herenow", function (req, res) {
    var venueId = req.params.id;

    console.log("here: " + venueId);
    console.log("type: " + typeof venueId);

    foursquare.Venues.getVenueAspect(venueId, "herenow", {}, req.session.token, function (error, result) {
        // console.log("result: " + result);
        // console.log("error:  " + error);
        if (!error) {
            console.log("success");
            res.set("Content-Type", "application/json");
            res.send(result);
        } else {
            console.log("error");
            console.log(error);
        }
        // res.send(result);
    });
});

// User Details
// app.get("/api/user/:id", api.user);

// Create Server
http.createServer(app).listen(app.get("port"), function () {
    console.log("Server listening on port " + app.get("port"));
});