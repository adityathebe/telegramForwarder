const knex = require('../services/database');

class Database {
  constructor() {}

  ///////////
  // USERS //
  ///////////
  getUser(chatId) {
    return knex('users')
      .select('*')
      .where({ chat_id: chatId })
      .first();
  }

  getAllUsers() {
    return knex('users').select('*');
  }

  saveUser(chatId, username, refCode) {
    return knex('users').insert({
      chat_id: chatId,
      ref_code: refCode,
      username,
    });
  }

  changeUserQuota(chatId, shouldIncrease) {
    const change = shouldIncrease ? 1 : -1;
    const sql = `UPDATE users SET quota = quota + ${change} WHERE chat_id = ${chatId}`;
    return knex.raw(sql);
  }

  getUserQuota(chatId) {
    return knex('user')
      .select('quote')
      .where({ chat_id: chatId });
  }

  //////////////////
  // REDIRECTIONS //
  //////////////////

  getRedirections(userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM redirections WHERE owner = "${userId}"`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  saveRedirection(owner, source, destination, srcTitle, destTitle) {
    return new Promise((resolve, reject) => {
      let sql =
        'INSERT INTO redirections (owner, source, destination, source_title, destination_title) ';
      sql += `VALUES("${owner}", "${source}", "${destination}", "${srcTitle}", "${destTitle}"); `;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  removeRedirection(redirectionId) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM redirections WHERE id = "${redirectionId}";`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  activateRedirection(redirectionId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE redirections SET active = 1 WHERE id = "${redirectionId}";`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  deactivateRedirection(redirectionId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE redirections SET active = 0 WHERE id = "${redirectionId}";`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
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
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO filters (id, ${filterName}) VALUES (?, ?) ON DUPLICATE KEY UPDATE ${filterName} = ?;`;
      this.connection.query(
        sql,
        [redirectionId, data, data],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  getFilter(redirectionId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM filters WHERE id = ?';
      this.connection.query(sql, [redirectionId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /////////////////////
  // Transformations //
  /////////////////////
  saveTransformation(redirectionId, oldPhrase, newPhrase, rank) {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO transformations (redirection_id, old_phrase, new_phrase, rank) VALUES (?, ?, ?, ?);';
      this.connection.query(
        sql,
        [redirectionId, oldPhrase, newPhrase, rank],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  getTransformation(transformationId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM transformations WHERE id = ?';
      this.connection.query(sql, [transformationId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  getTransformationsOfRedirection(redirectionId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM transformations WHERE redirection_id = ?';
      this.connection.query(sql, [redirectionId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  changeTransformationRank(transformationId, newRank) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE transformations SET rank = ? Where id = ?';
      this.connection.query(
        sql,
        [newRank, transformationId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  removeTransformation(transformationId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM transformations Where id = ?';
      this.connection.query(sql, [transformationId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
}

// Single Ton
module.exports = new Database();

if (require.main === module) {
  const db = new Database();
  db.changeUserQuota('1', true)
    .then(console.log)
    .catch(console.error);

  db.getUser('1').then(console.log);
}
