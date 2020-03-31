module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'ratings',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      weetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'weets',
          key: 'id'
        }
      }
    },
    {
      timestamps: false
    }
  );

  Rating.associate = models => {
    Rating.belongsTo(models.ratings, { foreignKey: 'userId' });
  };

  return Rating;
};
