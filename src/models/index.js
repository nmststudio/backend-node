const {
  DatabaseManager,
  BELONGS_TO,
  HAS_MANY,
  BELONGS_TO_MANY,
} = require('./../utils/databaseManager');
const configurationDatabase = require('../../config/database');

const models = [];
const databaseManager = new DatabaseManager(configurationDatabase.development);


require('fs').readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const name = file.replace('.js', '');
    exports[name] = models[name] = require(`./${file}`);
  }
});


// Setup all the models
for (const modelKey in models) {
  const model = models[modelKey];
  databaseManager.registerModel(models[modelKey]);
}

databaseManager.registerRelationship(models.studio, models.user, BELONGS_TO_MANY, { through: 'StudioOwner' }, false);
databaseManager.registerRelationship(models.user, models.studio, BELONGS_TO_MANY, { through: 'StudioOwner' }, false);


databaseManager.registerRelationship(models.studio, models.class, HAS_MANY);





databaseManager.listModels();
databaseManager.listRelationships();
databaseManager.sync();
