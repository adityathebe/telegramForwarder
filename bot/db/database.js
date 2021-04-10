const knex = require('../services/database');

class Database {
  constructor() {}

  ///////////
  // USERS //
  ///////////
  getUser(chatId) {
    return knex('users').select('*').where({ chat_id: chatId }).first();
  }

  getAllUsers() {
    return knex('users').select('*');
  }

  saveUser(chatId, username, refCode) {
    return knex.raw(`INSERT INTO users (chat_id, username, ref_code) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [
      chatId,
      username,
      refCode,
    ]);
  }

  changeUserQuota(chatId, change = 1) {
    const sql = `UPDATE users SET quota = quota + ${change} WHERE chat_id = ?`;
    return knex.raw(sql, [chatId]);
  }

  getUserQuota(chatId) {
    return knex('user').select('quote').where({ chat_id: chatId });
  }

  //////////////////
  // REDIRECTIONS //
  //////////////////
  getRedirections(userId) {
    return knex('redirections').select('*').where({ owner: userId });
  }

  saveRedirection(owner, source, destination, srcTitle, destTitle) {
    return knex('redirections').insert({
      owner,
      source,
      destination,
      source_title: srcTitle,
      destination_title: destTitle,
    });
  }

  removeRedirection(redirectionId) {
    return knex.raw('DELETE FROM redirections WHERE id = ?', [redirectionId]);
  }

  activateRedirection(redirectionId) {
    return knex.raw('UPDATE redirections SET active = ? WHERE id = ?', [1, redirectionId]);
  }

  deactivateRedirection(redirectionId) {
    return knex.raw('UPDATE redirections SET active = ? WHERE id = ?', [0, redirectionId]);
  }

  /////////////
  // FILTERS //
  /////////////

  /**
   * @param {Number} redirectionId
   * @param {String} filterName One of specific filter names
   * @param {} data filter state or filter keywords
   */
  saveFilter(redirectionId, filterName, data) {
    return knex.raw(
      `INSERT INTO filters (id, ${filterName}) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET ${filterName} = ?`,
      [redirectionId, data, data]
    );
  }

  getFilter(redirectionId) {
    return knex('filters').select('*').where({ id: redirectionId }).first();
  }

  /////////////////////
  // Transformations //
  /////////////////////
  saveTransformation(redirectionId, oldPhrase, newPhrase, rank) {
    return knex.raw(
      `INSERT INTO transformations (redirection_id, old_phrase, new_phrase, rank) VALUES (?, ?, ?, ?) RETURNING id`,
      [redirectionId, oldPhrase, newPhrase, rank]
    );
  }

  getTransformation(transformationId) {
    return knex('transformations').select('*').where({ id: transformationId }).first();
  }

  getTransformationsOfRedirection(redirectionId) {
    return knex('transformations').select('*').where({ redirection_id: redirectionId });
  }

  changeTransformationRank(transformationId, newRank) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE transformations SET rank = ? Where id = ?';
      this.connection.query(sql, [newRank, transformationId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  removeTransformation(transformationId) {
    return knex.raw('DELETE FROM transformations WHERE id = ?', [transformationId]);
  }
}

// Single Ton
module.exports = new Database();

if (require.main === module) {
  const db = new Database();
  // db.changeUserQuota('xxx', 100).then(console.log).catch(console.error);
  // db.getUser('xxx').then(console.log);
}
