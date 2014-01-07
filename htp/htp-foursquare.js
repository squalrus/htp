var nconf = require("nconf");

nconf.env().file({ file: "config.json" });

exports.foursquareOptions = {
    "foursquare" : {
        "version": "20140105"
    },

    "winston" : {
        "loggers" : {
            "core": {
                "console": {
                    "level": "warn"
                }
            },
            "venues": {
                "console": {
                    "level": "warn"
                }
            }
        }
    },

    "secrets": {
        "clientId":       nconf.get("4SQ_CLIENT_ID"),
        "clientSecret":   nconf.get("4SQ_CLIENT_SECRET"),
        "redirectUrl":    nconf.get("4SQ_REDIRECT_URL")
    }
};