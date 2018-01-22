// Requiring our models
var db = require("../models");

module.exports = function (app) {
    // Create new user
    app.post("/api/users/new", function (req, res) {
        // Create a User with the data available to us in req.body
        console.log(req.body);
        db.User.create(req.body).then(function (data) {
            res.json(data);
        });
    });
    // Get all users
    // This route needs to be BEFORE the findOne user route
    app.get("/api/users/all", function (req, res) {
        // Find all users in the users table
        db.User.findAll({}).then(function (data) {
            res.json(data);
        });
    });
    // Get one user by "id" column
    app.get("/api/users/:id", function (req, res) {
        // Find one user with the id in req.params.id and return them to the user with res.json
        db.User.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            res.json(data);
        });
    });


}