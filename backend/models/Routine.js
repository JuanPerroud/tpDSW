const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const { SET_IMMEDIATE } = require("sequelize/lib/deferrable");

const Routine = sequelize.define(
  "Routine",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    muscularGroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SET_IMMEDIATE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Routine",
    timestamps: true,
  },
);
Routine.belongsTo(User, { foreignKey: "creatorId", onDelete: "CASCADE" });

module.exports = Routine;
