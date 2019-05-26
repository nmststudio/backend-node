const studioModel = require('./../models/studio');
const userModel = require('./../models/user');
const User = userModel.getDatabaseModel()
const Studio = studioModel.getDatabaseModel()

const createStudio = function(req, res, next) {
  const name = req.body.name
  Studio.findOne({ where: { name } }).then((studio) => {
    if (studio) {
      res.status(303).send({ error: "Studio already exists" });
      return;
    }

    const data = {
      name,
    };
    userModel.getUser(req.user).then((user) => {
      Studio.create(data).then(studio => {
        user.addStudios(studio).then((newStudio) => {
          if (!newStudio) {
            res.status(500).send({ error: "Cannot create new Studio" });
            return;
          }

          if (newStudio) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(studio));
            return;
          }
        });
      });
    });
  });
}

const editStudio = function(req, res, next) {
  console.log(req.body)
  Studio.findOne({
    where: { id: req.body.id },
    include: [{
      model: User,
      where: { id: req.user }
    }]
  }).then(studio => {
    studio.update(req.body).then(() => {
      Studio.findOne({ where: { id: req.body.id } }).then((updatedStudio) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(updatedStudio));
      })

    });
  });
}


const getStudios = function(req, res) {

  userModel.getUser(req.user).then((user) => {
    user.getStudios().then((studios) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(studios));
    });
  });
};

const getStudio = function(req, res) {

  studioModel.getStudio(req.params.id).then((studio) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(studio));
  });
};

module.exports = {
  getStudios,
  getStudio,
  createStudio,
  editStudio,
};
