module.exports = function(app) {
    var movieAPI = require("../controller/movieAPIController");
        
    app.route("/movies")
        .get(movieAPI.showAllMovies) /* GET /movies  */
        .post(movieAPI.addMovie);    /* POST /movies */
        
    app.route("/movies/:movieID/comments")
        .get(movieAPI.showComments)  /* GET /movies  */
        .post(movieAPI.addComment);  /* POST /movies */
};