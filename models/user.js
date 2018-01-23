var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Define the User model
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Before we create a new user we will hash 
  // their password on the way into the database
  User.beforeCreate(function (model, options) {
    return new Promise(function (resolve, reject) {
      bcrypt.hash(model.password, null, null, function (err, hash) {
        if (err) return reject(err);
        model.password = hash;
        return resolve(model, options);
      });
    });
  });


  User.associate = function (models) {
    // Associating User with Activities
    // When an User is deleted, also delete any associated Activities
    User.hasMany(models.Activity, {
      onDelete: "cascade"
    });
  };

  return User;
};