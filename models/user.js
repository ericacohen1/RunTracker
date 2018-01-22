module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Define the User model
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      // - LC - would like to propose that we change this to "email". Reason being that there is an auto-generated "id" column
      // having another column like "userID" can be confusing. I'm thinking email might be a way we can have unique accounts
      // and allow users to log in with their email address. 
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: Datatype.STRING,
      allowNull: false,
    }
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
