const config = require('../config/index');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'x.db',
  },
  useNullAsDefault: true,
  // connection: {
  //   host: config.DB.host,
  //   user: config.DB.user,
  //   password: config.DB.password,
  //   database: config.DB.database,
  // },
});

// Create Tables
knex.schema.hasTable('users').then((hasTable) => {
  if (!hasTable) {
    knex.schema
      .createTable('users', (tableBuilder) => {
        tableBuilder.string('chat_id').primary();
        tableBuilder.string('username').unique();
        tableBuilder.string('ref_code').notNullable();
        tableBuilder.string('ref_by');
        tableBuilder.boolean('premium').defaultTo(false);
        tableBuilder.integer('quota').defaultTo(0);

        // Foreign Key
        tableBuilder.foreign('ref_by').references('ref_code').inTable('user');
      })
      .then((_) => console.log('User table created'));
  }
});

knex.schema.hasTable('redirections').then((hasTable) => {
  if (!hasTable) {
    knex.schema
      .createTable('redirections', (tableBuilder) => {
        tableBuilder.increments('id').primary();
        tableBuilder.string('owner').notNullable();
        tableBuilder.string('source').notNullable();
        tableBuilder.string('destination').notNullable();
        tableBuilder.boolean('source_title').notNullable();
        tableBuilder.integer('destination_title').notNullable();
        tableBuilder.boolean('active').defaultTo(false);

        // Foreign Key
        tableBuilder
          .foreign('owner', 'redirections_fk0')
          .references('chat_id')
          .inTable('user')
          .onDelete('cascade');
      })
      .then((_) => console.log('redirections table created'));
  }
});

knex.schema.hasTable('filters').then((hasTable) => {
  if (!hasTable) {
    knex.schema
      .createTable('filters', (tableBuilder) => {
        tableBuilder.increments('id').primary();
        tableBuilder.boolean('audio').notNullable();
        tableBuilder.boolean('video').notNullable();
        tableBuilder.boolean('photo').notNullable();
        tableBuilder.boolean('sticker').notNullable();
        tableBuilder.boolean('document').defaultTo(false);
        tableBuilder.boolean('hashtag').defaultTo(false);
        tableBuilder.boolean('link').defaultTo(false);
        tableBuilder.string('contain').defaultTo(false);
        tableBuilder.string('notcontain').defaultTo(false);

        tableBuilder
          .foreign('id')
          .references('id')
          .inTable('redirections')
          .onDelete('cascade');
      })
      .then((_) => console.log('filters table created'));
  }
});

knex.schema.hasTable('transformations').then((hasTable) => {
  if (!hasTable) {
    knex.schema
      .createTable('transformations', (tableBuilder) => {
        tableBuilder.increments('id').primary();
        tableBuilder.integer('redirection_id').notNullable();
        tableBuilder.string('old_phrase').notNullable();
        tableBuilder.string('new_phrase').notNullable();
        tableBuilder.integer('rank').notNullable();

        tableBuilder
          .foreign('redirection_id')
          .references('id')
          .inTable('transformations')
          .onDelete('cascade');
      })
      .then((_) => console.log('transformations table created'));
  }
});

module.exports = knex;
