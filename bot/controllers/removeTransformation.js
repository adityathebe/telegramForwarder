const database = require('../db/database');

const removeTransformation = (sender, transformationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      // Linked with the given transformations   //
      /////////////////////////////////////////////
      const transformation = await database.getTransformation(transformationId);
      if (transformation === undefined) throw new Error('Transformation does not exist');

      const redirections = await database.getRedirections(sender);
      const isOwner = redirections.filter(r => r.id == transformation['redirection_id']).length > 0;
      if (!isOwner) throw new Error('You are not the owner of the transformation.');

      ///////////////////////////
      // Delete transformation //
      ///////////////////////////
      await database.removeTransformation(transformationId);

      return resolve({ transformationId });
    } catch (err) {
      console.log(`[ERROR removeTransformation.js] : ${err}`);
      return reject(err);
    }
  });
};

module.exports = removeTransformation;
