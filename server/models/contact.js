// models/Contact.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define("Contact", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Contact;
};
