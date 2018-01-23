
var path = require("path");

module.exports = function (app) {
    // profile route loads profile.html
    app.get("/profile", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/profile.html"));
    });

    app.get("/signup", function(req, res){
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });
};