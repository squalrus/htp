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
    storageAccount      = nconf.get("AZURE_STORAGE_ACCOUNT"),
    storageAccessKey    = nconf.get("AZURE_STORAGE_ACCESS_KEY");

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
    // Turn on to debug /callback
    var debug = false;

    foursquare.getAccessToken({
        code: req.query.code
    }, function (error, accessToken) {
        if (error) {
            res.send("An error was thrown: " + error.message);
        } else {
            // Save the accessToken and redirect
            req.session.token = accessToken;
            res.redirect("/venues");

            if (debug) {
                console.log("GET: /callback");
                console.log("accessToken: " + accessToken);
                console.log("code:  " + req.query.code);
                console.log("");
            }
        }
    });
});

// Venues
app.get("/venues", function (req, res) {
    var debug = false;

    res.render("venues");

    if (debug) {
        console.log("GET: /venues");
        console.log("");
    }
});

// Venue
app.get("/venues/:id", function (req, res) {
    var debug = false;

    if (debug) { console.log("GET: /venues/:id"); }

    // Foursqare data
    http.get("http://localhost:3000/api/venues/" + req.param("id"), function (response) {
        var venueData = "";

        response.on("data", function (chunk) {
            venueData += chunk;
        });

        response.on("end", function () {
            if (debug) { console.log("venueData: " + venueData); }

            res.render("venue", { v: JSON.parse(venueData) });
        });

    }).on("error", function (error) {
        // Account for this
        if (debug) { console.log("error: " + error.message); }
    });

    if (debug) { console.log(""); }
});

// Venue
app.post("/venues/:id", function (req, res) {
    var debug = false;

    if (debug) { console.log("POST: /venues/:id"); }

    // Write the rating (move to POST method)
    var entity = {
        PartitionKey: "me",
        RowKey: req.param("id"),
        Rating: 4
    };

    if (debug) {
        console.log("storageAccount: " + storageAccount);
        console.log("storageAccessKey: " + storageAccessKey);
    }

    var tableService = azure.createTableService(storageAccount, storageAccessKey);
    tableService.insertOrReplaceEntity("pissers", entity, function (error) {
        if (!error) {
            // Do something
        }
    });

    if (debug) { console.log(""); }
});

// Profile
app.get("/me", function (req, res) {
    // Foursquare data

    // HTP data
    var tableService = azure.createTableService(storageAccount, storageAccessKey);
    var query = azure.TableQuery
        .select()
        .from("pissers")
        .where("PartitionKey eq ?", "me");
    tableService.queryEntities(query, function (error, entities) {
        if (!error) {
            console.log(entities);
            res.render("user", { u: entities });
        }
    });
});


/*
 * API Routing
 *
 * API wrapper for Hows The Pisser for connecting to Foursquare.
 */
// Venues
app.get("/api/venues", function (req, res) {
    var debug = false;

    if (req.query && req.query.lat && req.query.lon) {
        foursquare.Venues.explore(req.query.lat, req.query.lon, { radius: 500 }, req.session.token, function (error, result) {
            res.set("Content-Type", "application/json");
            res.send(result);
        });
    } else {
        res.set("Content-Type", "application/json");
        res.send({ "error": "lat/lon not provided" });
    }

    if (debug) {
        console.log("API GET: /api/venues");
        console.log("latitude : " + req.query.lat);
        console.log("longitude: " + req.query.lon);
        console.log("");
    }
});

// Venue Details
app.get("/api/venues/:id", function (req, res) {
    var debug = false;
    var venueId = req.param("id");

    foursquare.Venues.getVenue(venueId, req.session.token, function (error, result) {
        if (!error) {
            res.set("Content-Type", "application/json");
            res.send(result);
        }
    });

    if (debug) {
        console.log("API GET: /api/venues/:id");
        console.log("");
    }
});

// Venue herenow
app.get("/api/venues/:id/herenow", function (req, res) {
    var debug = false;
    var venueId = req.params.id;

    foursquare.Venues.getVenueAspect(venueId, "herenow", {}, req.session.token, function (error, result) {
        if (!error) {
            res.set("Content-Type", "application/json");
            res.send(result);
        }
    });

    if (debug) {
        console.log("API GET: /api/venues/:id/herenow");
        console.log("");
    }
});

// User Details
// app.get("/api/user/:id", api.user);

// Create Server
http.createServer(app).listen(app.get("port"), function () {
    console.log("Server listening on port " + app.get("port"));
});