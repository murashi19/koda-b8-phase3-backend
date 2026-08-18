"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Links.belongsTo(models.Users, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  Links.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      original_url: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Links",
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return Links;
};
