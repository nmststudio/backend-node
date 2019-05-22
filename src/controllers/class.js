const studioModel = require('./../models/studio');
const classModel = require('./../models/class');
const userModel = require('./../models/user');


const User = userModel.getDatabaseModel()
const Studio = studioModel.getDatabaseModel()
const Class = classModel.getDatabaseModel()

const createClass = function(req, res, next) {

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
      name: req.body.name || 'Test class',
      startDate: req.body.startDate || new Date(),
      endDate: req.body.endDate || new Date(),
    }
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

  userModel.getUser(req.user).then((user) => {
    user.getStudios().then((studios) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(studios));
    });
  });
};

module.exports = {
  getClasses,
  createClass,
};
