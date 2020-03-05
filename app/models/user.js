module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true
        }
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          isEmail: true,
          is: /\S+@wolox.\S+/
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          min: 8,
          is: /^[a-zA-Z0-9]*$/
        }
      }
    },
    {
      timestamps: false
    }
  );

  User.findByEmail = email =>
    User.findOne({
      where: {
        email
      }
    });

  return User;
};
