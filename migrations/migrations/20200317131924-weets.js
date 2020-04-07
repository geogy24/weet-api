'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('weets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    }),
  down: queryInterface => queryInterface.dropTable('weets')
};
