'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable(
    'test_table',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATA,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      },
      testString: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('test_table');
  }
};
