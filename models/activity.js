module.exports = function (sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
      distance: {
      type: DataTypes.INTEGER
    },
    //   time in minutes
    totalActivityTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pace: {
      type: DataTypes.INTEGER,
    }
  });

  Activity.associate = function (models) {
    // We're saying that a Activity should belong to an User
    // A Activity can't be created without an User due to the foreign key constraint
    Activity.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Activity;
};
