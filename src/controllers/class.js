const studioModel = require('./../models/studio');
const classModel = require('./../models/class');
const userModel = require('./../models/user');


const User = userModel.getDatabaseModel()
const Studio = studioModel.getDatabaseModel()
const Class = classModel.getDatabaseModel()

const createClass = function(req, res, next) {
  console.log(req.body)
  Studio.findOne({
    where: { id: req.body.studioId },
    include: [{
      attributes: [],
      model: User,
      where: { id: req.user }
    }]
  }).then(studio => {
    console.log('STUDIO', studio)
    if (!studio) {
      res.status(404).send({ error: 'Studio doesn\'t exist' });
      return;
    }
    const data = {
      name: req.body.event.title || 'Test class',
      startTime: req.body.event.start || new Date(),
      endTime: req.body.event.end || new Date(),
    }
    console.log('CREATE EVENT', data)
    Class.create(data).then(newClass => {
      studio.addClass(newClass).then((classStudio) => {
        if (!classStudio) {
          res.status(500).send({ error: "Cannot create new Class" });
          return
        }
        if (classStudio) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(newClass));
          return;
        }
      })
    })

  });
}
const getClasses = function(req, res) {

  Class.findAll({ where: { studioId: req.params.id } }).then((classes) => {

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(classes));

  });
};

const editClass = function(req, res) {
  // TODO: URGENT: this put doesn't have an authentication strategy
  console.log(req.params.id)
  Class.findOne({
    where: { id: req.params.id }
  }).then(classInstance => {
    console.log(classInstance);
    const data = {
      name: req.body.title,
      startTime: req.body.start,
      endTime: req.body.end
    }
    classInstance.update(data).then(() => {
      Class.findOne({ where: { id: req.params.id } }).then((updatedClass) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(updatedClass));
      })

    });
  });
};


module.exports = {
  getClasses,
  createClass,
  editClass
};
