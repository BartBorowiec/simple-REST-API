var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser");
    
mongoose.connect("mongodb://localhost/movies");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var route = require("./routes/movieAPIRoutes.js");
route(app);
    
app.listen(port, process.env.IP, function() {
    console.log("The API server is running on port: "+ port);
});