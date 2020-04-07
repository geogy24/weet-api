'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'administrator', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'administrator')
};
