const studioModel = require('./../models/studio');
const userModel = require('./../models/user');

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
const getStudios = function(req, res) {

  userModel.getUser(req.user).then((user) => {
    user.getStudios().then((studios) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(studios));
    });
  });
};

module.exports = {
  getStudios,
  createStudio,
};
