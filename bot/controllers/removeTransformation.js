const database = require('../db/database');

const removeTransformation = (sender, transformationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      // Linked with the given transformations   //
      /////////////////////////////////////////////
      const transformations = await database.getTransformation(transformationId);
      if (transformations.length === 0) throw new Error('Transformation does not exist');
      
      const redirections = await database.getRedirections(sender);
      if (redirections.length === 0) throw new Error('You are not the owner of the transformation.');

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

}

module.exports = removeTransformation;
