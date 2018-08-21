require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var inquirer = require("inquirer");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

inquirer.prompt([
    {
        type: "list",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "function",
        message: "What would you like to do?"
    }
]).then(function(response){
    if (response.function === "concert-this") {
        inquirer.prompt([
            {
                name: "artist",
                message: "Please enter an artist or band to search."
            }
        ]).then(function(band){
            request("https://rest.bandsintown.com/artists/" + band.artist + "/events?app_id=codingbootcamp", function(error, response, body){
                if (!error && response.statusCode === 200) {
                    // console.log(body);
                    console.log("Next Show:")
                    console.log("Venue: " + JSON.parse(body)[0].venue.name);
                    console.log("");
                    console.log("Location: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region);
                    console.log("");
                    console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM-DD-YYYY"));
                  } else {
                      console.log(error);
                  }
            })
        })
    } else if (response.function === "spotify-this-song") {
        inquirer.prompt([
            {
                name: "song",
                message: "Enter a song to search for.",
            }
        ]).then(function(response){
            if (response.song === "") {
                spotify.search({type: "track", query: "The Sign"}, function(error, response){
                    console.log("Song: " + response.tracks.items[5].name);
                    console.log("Album: " + response.tracks.items[5].album.name);
                    console.log("Artist: " + response.tracks.items[5].artists[0].name)
                    console.log("Listen here: " + response.tracks.items[5].preview_url)
            })
            } else {
                spotify.search({type: "track", query: response.song, limit: 10}, function(error, response){
                    if (error) {
                        console.log(error)
                    } else {
                        for (i=0; i< 10; i++) {
                            console.log("#" + (i+1) + ":")
                            console.log("");
                            console.log("Song: " + response.tracks.items[i].name);
                            console.log("Album: " + response.tracks.items[i].album.name);
                            console.log("Artist: " + response.tracks.items[i].artists[0].name)
                            console.log("Listen here: " + response.tracks.items[i].preview_url)
                            console.log("====================================================================");
                            console.log("");
                        }
                    }
                })
            }
        })
    } else if (response.function === "movie-this") {
        inquirer.prompt([
            {
                name: "movie",
                message: "Please enter a movie to search."
            }
        ]).then(function(response){
            if (response.movie === "") {
                request("https://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy", function(error, response, body){
                    console.log("Title: " + JSON. parse(body).Title);
                    console.log("Year of release: " + JSON. parse(body).Year);
                    console.log("IMDB rating: " + JSON. parse(body).imdbRating);
                    console.log("Rotten Tomatoes rating: " + JSON. parse(body).Ratings[1].Value);
                    console.log("Country where produced: " + JSON. parse(body).Country);
                    console.log("Language(s): " + JSON. parse(body).Language);
                    console.log("Plot: " + JSON. parse(body).Plot);
                    console.log("Actors: " + JSON. parse(body).Actors);
                })
            } else {
                request("https://www.omdbapi.com/?t=" + response.movie + "&y=&plot=short&apikey=trilogy", function(error, response, body){
                    if (!error && response.statusCode === 200) {
                        console.log("Title: " + JSON. parse(body).Title);
                        console.log("Year of release: " + JSON. parse(body).Year);
                        console.log("IMDB rating: " + JSON. parse(body).imdbRating);
                        console.log("Rotten Tomatoes rating: " + JSON. parse(body).Ratings[1].Value);
                        console.log("Country where produced: " + JSON. parse(body).Country);
                        console.log("Language(s): " + JSON. parse(body).Language);
                        console.log("Plot: " + JSON. parse(body).Plot);
                        console.log("Actors: " + JSON. parse(body).Actors);
                    } else {
                        console.log(error);
                    }
                })
            }
        })
    } else {
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error) {
                console.log(error)
            } else {
                data = data.split(",");
                if (data[0] ==="concert-this") {
                    request("https://rest.bandsintown.com/artists/" + data[1] + "/events?app_id=codingbootcamp", function(error, response, body){
                    if (!error && response.statusCode === 200) {
                        // console.log(body);
                        console.log("Next Show:")
                        console.log("Venue: " + JSON.parse(body)[0].venue.name);
                        console.log("");
                        console.log("Location: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region);
                        console.log("");
                        console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM-DD-YYYY"));
                    } else {
                        console.log(error);
                  }
            })
                } else if (data[0] === "spotify-this-song") {
                    spotify.search({type: "track", query: data[1], limit: 10}, function(error, response){
                        if (error) {
                            console.log(error)
                        } else {
                            for (i=0; i< 10; i++) {
                                console.log("#" + (i+1) + ":")
                                console.log("");
                                console.log("Song: " + response.tracks.items[i].name);
                                console.log("Album: " + response.tracks.items[i].album.name);
                                console.log("Artist: " + response.tracks.items[i].artists[0].name)
                                console.log("Listen here: " + response.tracks.items[i].preview_url)
                                console.log("====================================================================");
                                console.log("");
                            }
                        }
                    })
                } else if (data[0] === "movie-this") {
                    request("https://www.omdbapi.com/?t=" + data[1] + "&y=&plot=short&apikey=trilogy", function(error, response, body){
                        if (!error && response.statusCode === 200) {
                            console.log("Title: " + JSON. parse(body).Title);
                            console.log("Year of release: " + JSON. parse(body).Year);
                            console.log("IMDB rating: " + JSON. parse(body).imdbRating);
                            console.log("Rotten Tomatoes rating: " + JSON. parse(body).Ratings[1].Value);
                            console.log("Country where produced: " + JSON. parse(body).Country);
                            console.log("Language(s): " + JSON. parse(body).Language);
                            console.log("Plot: " + JSON. parse(body).Plot);
                            console.log("Actors: " + JSON. parse(body).Actors);
                        } else {
                            console.log(error);
                        }
                    })
                }
            }
        })
    }
})