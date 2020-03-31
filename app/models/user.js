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
        allowNull: false
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      administrator: {
        type: DataTypes.BOOLEAN
      },
      position: {
        // eslint-disable-next-line new-cap
        type: DataTypes.VIRTUAL(DataTypes.BOOLEAN, [
          [sequelize.fn('sum', sequelize.col('ratings.score')), 'score']
        ]),
        // eslint-disable-next-line complexity
        get() {
          let position = 'Developer';
          const score = this.get('score');

          if (score !== null) {
            if (score >= 6 && score <= 9) {
              position = 'Lead';
            } else if (score >= 10 && score <= 19) {
              position = 'TL';
            } else if (score >= 20 && score <= 29) {
              position = 'EM';
            } else if (score >= 30 && score <= 49) {
              position = 'HEAD';
            } else if (score >= 50) {
              position = 'CEO';
            }
          }

          return position;
        }
      }
    },
    {
      timestamps: false
    }
  );

  User.associate = models => {
    User.hasMany(models.ratings, { foreignKey: 'userId', sourceKey: 'id' });
  };

  User.findByEmail = email =>
    User.findOne({
      where: {
        email
      }
    });

  return User;
};
