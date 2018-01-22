// Requiring our models
var db = require("../models");

module.exports = function (app) {

    // Add a new activity
    app.post("/api/activity/new", function(req, res) {
        db.Activity.create(req.body).then(function(data) {
          res.json(data);
        });
      });
    // Get all activities
    app.get("/api/activity/all", function (req, res) {
        var query = {};
        if (req.query.userID) {
            query.userID = req.query.userID;
        }
        db.Activity.findAll({
            where: query
        }).then(function (data) {
            res.json(data);
        });
    });
    // Get a single activity
    app.get("/api/activity/:id", function (req, res) {
        db.Activity.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            console.log(data);
            res.json(data);
        });
    });
    // Update an existing activity
    // Delete an activity
};