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
  // Account informations
  firstname: {
    type: Sequelize.STRING,
    //    notEmpty: true,
  },
  lastname: {
    type: Sequelize.STRING,
    //    notEmpty: true,
  },
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
