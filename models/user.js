module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    userID: DataTypes.INTEGER,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    sex: DataTypes.STRING,
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
