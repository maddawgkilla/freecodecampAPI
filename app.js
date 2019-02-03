const express = require("express");
const app = express();

app.enable('trust proxy');

app.get("/api/timestamp/:date_string", (req,res) => {
    const input = req.params.date_string;
    const check = new Date(input);
    console.log(input);
    if (check == "Invalid Date") {
        res.json({"error": "Invalid Date"});
    } else {
        res.json({ unix: check.getTime(), utc: check.toUTCString() });
    }
});

app.get('/api/whoami', (req, res) => {
    const data = req;
    // console.log(data);
    const result = { ipaddress: data.ip, language: data.headers["accept-language"], software: data.headers["user-agent"] };
    console.log(result);
    res.json(result);
});

app.listen(3000, () => {
    console.log("The server is up");
});