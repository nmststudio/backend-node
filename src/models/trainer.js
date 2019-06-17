const Sequelize = require('sequelize');

let db = null;

function registerDatabaseModel(model) {
  db = model;
}

function getDatabaseModel() {
  return db;
}


const name = 'trainer';
const schema = {
  name: {
    type: Sequelize.STRING,
  }
};

// Access and Editors
function getTrainer(id) {
  return db.findOne({ where: { id } });
}

function getAllTrainers() {
  console.log('fetch all studios')
  return db.findAll();
}


const Trainer = {
  name,
  schema,
  registerDatabaseModel,
  getDatabaseModel,
  getTrainer,
  getAllTrainers,
};
module.exports = Trainer;
