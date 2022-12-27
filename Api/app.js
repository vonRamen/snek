const express = require('express');
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
const cheerio = require('cheerio');
let ObjectID = require('mongodb').ObjectId;
const axios = require('axios');

const connectionString = "mongodb://root:example@localhost:27017/?authMechanism=DEFAULT";

const client = new MongoClient(connectionString);
const database = client.db("snek");
const highscoreCollection = database.collection("highscores");

const app = express();
app.use(express.json());
const PORT = 80;

//post
app.post('/highscores/submit/:name/:score', (req, res) => {

    highscoreCollection.find()
        .toArray(function(err, result) {
            if (err) {
                res.status(400).send("Error!");
            } else {
                if (Array.isArray(result)) {
                    if(result.length == 1) {
                        result = result[0]
                    } else {
                        result = {
                            _id: "Highscore",
                            scores: result
                        }
                    }
                }

                result.scores.push({name: req.params.name, score: parseInt(req.params.score)})
                result.scores.sort((x, y) => x.score > y.score ? -1 : 1)
                if(result.scores.length >= 10) {
                    result.scores = result.scores.slice(0, 10)
                }

                var count = 1
                for(score of result.scores) {
                    score.rank = (count++)
                }

                highscoreCollection.updateOne({_id: "Highscore"}, {$set: {scores: result.scores}}, {upsert: true})

                res.json(result.scores)
            }
        });
});
app.get('/highscores/', (req, res) => {

    highscoreCollection.find()
        .toArray(function(err, result) {
            if (err) {
                res.status(400).send("Error!");
            } else {
                if (Array.isArray(result)) {
                    if(result.length == 1) {
                        result = result[0]
                    } else {
                        result = {
                            _id: "Highscore",
                            scores: result
                        }
                    }
                }

                res.json(result.scores)
            }
        });
});

app.get('/highscores/eligible/:name/:score', (req, res) => {

    highscoreCollection.find()
        .toArray(function(err, result) {
            if (err) {
                res.status(400).send("Error!");
            } else {
                if (Array.isArray(result)) {
                    if(result.length == 1) {
                        result = result[0]
                    } else {
                        result = {
                            _id: "Highscore",
                            scores: result
                        }
                    }
                }

                result.scores.push({name: req.params.name, score: parseInt(req.params.score), user:true})
                result.scores.sort((x, y) => x.score > y.score ? -1 : 1)
                if(result.scores.length >= 10) {
                    result.scores = result.scores.slice(0, 10)
                }

                var count = 1
                for(score of result.scores) {
                    if(score.user) break;
                    score.rank = (count++)
                }

                res.json(count)
            }
        });
});

//post
app.post('/highscores/:name/:score', (req, res) => {

    highscoreCollection.find()
        .toArray(function(err, result) {
            if (err) {
                res.status(400).send("Error!");
            } else {
                if (Array.isArray(result)) {
                    if(result.length == 1) {
                        result = result[0]
                    } else {
                        result = {
                            _id: "Highscore",
                            scores: result
                        }
                    }
                }

                result.scores.push({name: req.params.name, score: parseInt(req.params.score)})
                result.scores.sort((x, y) => x.score > y.score ? -1 : 1)
                if(result.scores.length >= 10) {
                    result.scores = result.scores.slice(0, 10)
                }

                highscoreCollection.updateOne({_id: "Highscore"}, {$set: {scores: result.scores}}, {upsert: true})

                res.json(result.scores)
            }
        });
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);