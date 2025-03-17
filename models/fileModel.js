const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 
const { v4: uuidv4 } = require("uuid");


// Define the File model
const File = sequelize.define("File", {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuidv4(),  
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "files",
    timestamps: false, 
});


module.exports = File;
