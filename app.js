const express = require("express");
const app = express();

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

app.listen(3000, () => {
    console.log("The server is up");
});