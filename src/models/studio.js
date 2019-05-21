const Sequelize = require('sequelize');

let db = null;

function registerDatabaseModel(model) {
  db = model;
}

const name = 'studio';
const schema = {
  name: {
    type: Sequelize.STRING,
  },
};


const Studio = {
  name,
  schema,
  registerDatabaseModel,
};
module.exports = Studio;
