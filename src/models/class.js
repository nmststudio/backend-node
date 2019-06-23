const Sequelize = require('sequelize');
const userModel = require('./user');

let db = null;

function registerDatabaseModel(model) {
  db = model;
}

function getDatabaseModel() {
  return db;
}


const name = 'class';
const schema = {
  name: {
    type: Sequelize.STRING,
  },
  startTime: {
    type: Sequelize.DATE,
  },
  endTime: {
    type: Sequelize.DATE,
  },
};

// Access and Editors
function getClass(id) {
  return db.findOne({ where: { id } });
}

function getAllClasses() {
  console.log('fetch all studios')
  return db.findAll({
    include: [{
      model: userModel,
    }]
  });
}


const Class = {
  name,
  schema,
  registerDatabaseModel,
  getDatabaseModel,
  getClass,
  getAllClasses,
};
module.exports = Class;
