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


// Relationship Class
databaseManager.registerRelationship(models.studio, models.class, HAS_MANY);

// Relationship Trainer
databaseManager.registerRelationship(models.studio, models.trainer, HAS_MANY);
databaseManager.registerRelationship(models.trainer, models.class, BELONGS_TO_MANY, { through: 'ClassTrainer' }, false);
databaseManager.registerRelationship(models.class, models.trainer, BELONGS_TO_MANY, { through: 'ClassTrainer' }, false);





databaseManager.listModels();
databaseManager.listRelationships();
databaseManager.sync();
