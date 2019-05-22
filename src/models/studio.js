const Sequelize = require('sequelize');

let db = null;

function registerDatabaseModel(model) {
  db = model;
}

function getDatabaseModel() {
  return db;
}


const name = 'studio';
const schema = {
  name: {
    type: Sequelize.STRING,
  },
};

// Access and Editors
function getStudio(id) {
  return db.findOne({ where: { id } });
}

function getAllStudios() {
  console.log('fetch all studios')
  return db.findAll();
}


const Studio = {
  name,
  schema,
  registerDatabaseModel,
  getDatabaseModel,
  getStudio,
  getAllStudios,
};
module.exports = Studio;
