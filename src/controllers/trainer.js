const studioModel = require('./../models/studio');
const classModel = require('./../models/class');
const userModel = require('./../models/user');
const trainerModel = require('./../models/trainer');

const User = userModel.getDatabaseModel()
const Studio = studioModel.getDatabaseModel()
const Class = classModel.getDatabaseModel()
const Trainer = trainerModel.getDatabaseModel()



const createTrainer = function(req, res, next) {
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
      name: req.body.event.name || 'Trainer',
    }
    console.log('CREATE EVENT', data)
    Trainer.create(data).then(newTrainer => {
      studio.addTrainer(newTrainer).then((trainerStudio) => {
        if (!trainerStudio) {
          res.status(500).send({ error: "Cannot create new Trainer" });
          return
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(trainerStudio));
          return;
        }
      })
    })

  });
}
const getTrainers = function(req, res) {

  Trainer.findAll({ where: { studioId: req.params.id } }).then((trainers) => {

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(trainers));

  });
};

const editTrainer = function(req, res) {
  // TODO: URGENT: this put doesn't have an authentication strategy
  console.log(req.params.id)
  Trainer.findOne({
    where: { id: req.params.id }
  }).then(trainerInstance => {
    console.log(trainerInstance);
    const data = {
      name: req.body.name,
    }
    trainerInstance.update(data).then(() => {
      Trainer.findOne({ where: { id: req.params.id } }).then((updatedTrainer) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(updatedTrainer));
      })

    });
  });
};


module.exports = {
  getTrainers,
  createTrainer,
  editTrainer
};
