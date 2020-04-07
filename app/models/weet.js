module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'weets',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      timestamps: false
    }
  );

  Weet.associate = models => {
    Weet.belongsTo(models.users, { sourceKey: 'userId' });
  };

  Weet.userHaveMaxQuantityWeets = () =>
    Weet.findAll({
      attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('*')), 'quantity']],
      include: [
        {
          model: sequelize.models.users,
          attributes: ['email', 'name']
        }
      ],
      group: ['weets.userId', 'user.id', 'user.email', 'user.name'],
      order: sequelize.literal('quantity DESC')
    });

  return Weet;
};
