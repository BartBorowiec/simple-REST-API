var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser");
    
mongoose.connect("mongodb://localhost/movies3");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var route = require("./routes/movieAPIRoutes.js");
route(app);
    
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The NGMDB is running!");
});