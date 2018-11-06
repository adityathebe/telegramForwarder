const mysql = require('mysql');
const DB_CONFIG = require('../config/database');

class Database {

  constructor() {
    this.connection = mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
    });

    this.connection.connect(function (err, data) {
      if (err) {
        throw new Error('Error connecting: ' + err.stack);
      }

      console.log(`Connected to Database. Server status ${data.serverStatus}`);
    });
  }

  ///////////
  // USERS //
  ///////////

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM users', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    })
  }

  saveUser(chatId, username, refCode) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (chat_id, username, ref_code) VALUES ("${chatId}", "${username}", "${refCode}");`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  changeUserQuota(userId, shouldIncrease) {
    return new Promise((resolve, reject) => {
      const change = shouldIncrease ? 1 : -1;
      const sql = `UPDATE users SET quota = quota + ${change} WHERE id = ${userId}`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  getUserQuota(userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT quota FROM users WHERE id = "${userId}"`;
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        if (results.length === 0) return reject(new Error('User does not exist'));
        resolve(results[0].quota);
      });
    });
  }

  //////////////////
  // REDIRECTIONS //
  //////////////////
  
  getAllRedirections() {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM redirections', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  saveRedirection(owner, source, destination) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO redirections (owner, source, destination) VALUES("${owner}", "${source}", "${destination}"); `;
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
   * @param {Boolean} state filter state
   * @param {String} params Array of words
   */
  saveFilter(redirectionId, filterName, state, params = null) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO filters (red_id, name, state, params) VALUES ("${redirectionId}", "${filterName}", "${state}", "${params}");`
      this.connection.query(sql, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  getFilter(redirectionId) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM filters WHERE red_id = "${redirectionId}"`, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
}

const db = new Database();

module.exports = db;
