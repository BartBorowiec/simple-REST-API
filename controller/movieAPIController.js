var mongoose = require("mongoose"),
    request  = require('request'),
    Movie    = require('../models/movie'),
    Comment  = require('../models/comment');

// GET /movies
//    Should fetch list of all movies already present in application database.
//    Additional filtering, sorting is fully optional - but some implementation is a bonus.

exports.showAllMovies = (req, res) => {
  Movie.find({}, (err, allMovies) => {
    if (err) return res.send(err);
    allMovies.sort((a,b) => {
                if (a.Title < b.Title) return -1;
                if (a.Title > b.Title) return 1;
                return 0;
            });
    res.json(allMovies);
  });
};

// POST /movies
//    Request body should contain only movie title, and its presence should be validated.
//    Based on passed title, other movie details should be fetched from http://www.omdbapi.com/ (or other similar, public movie database) - and saved to application database.
//    Request response should include full movie object, along with all data fetched from external API.

exports.addMovie = (req, res) => {
    if (req.body.title === undefined) return res.send("Title is undefined");
    
    request('http://www.omdbapi.com/?apikey=effdb1e6&t='+req.body.title , (error, response, body) => {
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            if(data.Response === "True") {
                var movie = new Movie(data);
                movie.save((err, movie) => {
                if (err) return res.send(err);
                res.json(movie);
                });
            } else {
                return res.send("Could not find the title in external database");
            }
        } else {
            return res.send(error);
        }
    });
};

// GET /comments
//    Should fetch list of all comments present in application database.
//    Should allow filtering comments by associated movie, by passing its ID.

exports.showComments = (req, res) => {
    if (req.params.movieID === undefined) res.send("Movie ID is undefined");
    
    if (req.params.movieID === "all") {
        Comment.find({}, (err, allComments) => {
            if (err) return res.send(err);
            res.json(allComments);
        });
    } else {
        Movie.findOne({imdbID: req.params.movieID}).populate("Comments").exec((err, foundMovie) => {
            if (err) return res.send(err);
            if (foundMovie) {
                    res.json(foundMovie.Comments);
            } else {
                return res.send("Movie not found");
            }
        });
    }
};

// POST /comments
//    Request body should contain ID of movie already present in database, and comment text body.
//    Comment should be saved to application database and returned in request response.

exports.addComment = (req, res) => {
    if (req.params.movieID === undefined) res.send("Movie ID is undefined");
    
    Movie.findOne({imdbID: req.params.movieID}, (err, foundMovie) => {
        if (err) return res.send(err);
        if(foundMovie){
            Comment.create({text: req.body.text}, (err, comment) => {
                if (err) return res.send(err);
                foundMovie.Comments.push(comment);
                foundMovie.save();
                return res.send(comment);
            });
        } else {
            return res.send("Movie not found");
        }
    });
};