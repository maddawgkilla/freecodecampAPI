const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const dns = require("dns");
var validUrl = require('valid-url');
const app = express();

const db = require('./config/keys').MongoURI;

mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log('Mongo DB Connected');
}).catch((err) => {
    throw err
});

const Url = require("./models/Url");

app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.get("/api/timestamp/:date_string", (req, res) => {
    const input = req.params.date_string;
    const check = new Date(input);
    console.log(input);
    if (check == "Invalid Date") {
        res.json({
            "error": "Invalid Date"
        });
    } else {
        res.json({
            unix: check.getTime(),
            utc: check.toUTCString()
        });
    }
});

app.get('/api/whoami', (req, res) => {
    const data = req;
    // console.log(data);
    const result = {
        ipaddress: data.ip,
        language: data.headers["accept-language"],
        software: data.headers["user-agent"]
    };
    console.log(result);
    res.json(result);
});

app.get('/api/shorturl/new', (req, res) => {
    console.log("Getted it");
    res.render("home");
});

app.get('/api/shorturl/:fetchurl', (req, res) => {
    let squery = req.params.fetchurl;
    let nquery = Number(req.params.fetchurl);
    Url.findOne({
        short_url: nquery
    }).then((foundUrl) => {
        // console.log(foundUrl.orig_url);
        const redirectlink = foundUrl.orig_url;
        // res.redirect(redirectlink);
        // console.log(redirectlink);
        res.redirect(301, redirectlink);
    }).catch((err) => {
        throw err;
    });
});

app.post('/api/shorturl/new', (req, res) => {
    if (validUrl.isUri(req.body.orig_url)) {
        Url.findOne().where('orig_url').equals(req.body.orig_url).then((url) => {
            // console.log(url);
            if (!url) {
                console.log("url does not exist");
                const newUrl = new Url({
                    orig_url: req.body.orig_url
                });
                newUrl.save().then((savedUrl) => {
                    console.log("created entry " + savedUrl);
                    res.json({
                        original_url: savedUrl.orig_url,
                        short_url: savedUrl.short_url
                    });
                }).catch((err) => {
                    throw err;
                });
            } else {
                console.log("URL does exist");
            }
        }).catch((err) => {
            throw err;
        });
    } else {
        // console.log(err);
        res.json({
            error: "Invalid URL"
        });
    }
});

app.get('/testing', (req, res) => {
    res.redirect(301, "google.com");
});

app.listen(3000, () => {
    console.log("The server is up");
});