'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      weetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'weets',
          key: 'id'
        }
      }
    }),
  down: queryInterface => queryInterface.dropTable('ratings')
};
