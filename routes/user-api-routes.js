// Requiring our models
var db = require("../models");
var bcrypt = require("bcrypt-nodejs");
module.exports = function (app) {
    app.post("/api/users/new", function (req, res) {
        // Create a User with the data available to us in req.body
        console.log(req.body);
        db.User.create(req.body).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // Get all users
    // This route needs to be BEFORE the findOne user route
    app.get("/api/users/all", function (req, res) {
        // Find all users in the users table
        db.User.findAll({}).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            console.log(err);
        });
    });
    app.post("/api/users", function (req, res) {
        
        // console.log("hello", req.body);
        db.User.findOne({
            where: {
                email: req.body.email,
            }
        }).then(function (data) {
            var res1 = res
            bcrypt.compare(req.body.password, data.password, function(err, res) {
                if(res) {
                   res1.json(data)
                }else {return}
            });
            
        }).catch(function(error) {
            res.send(error);
        })
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
        }).catch(function (err) {
            console.log(err);
        });
    });

    app.put("/api/users/:id", function (req, res) {
        db.User.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (data) {
                res.json(data)
            }).catch(function (err) {
                console.log(err);
            });
    });
}
