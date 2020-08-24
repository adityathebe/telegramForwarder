const { DB_HOST } = require('../config');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: DB_HOST,
    user: 'postgres',
    password: 'mysecretpassword',
    database: 'telegram',
  },
});

(async () => {
  // Create Tables
  const hasUserTable = await knex.schema.hasTable('users');
  if (!hasUserTable) {
    await knex.schema.createTable('users', (tableBuilder) => {
      tableBuilder.string('chat_id').primary();
      tableBuilder.string('username').unique();
      tableBuilder.string('ref_code').notNullable().unique();
      tableBuilder.string('ref_by');
      tableBuilder.boolean('premium').defaultTo(false);
      tableBuilder.integer('quota').defaultTo(0);

      // Foreign Key
      tableBuilder.foreign('ref_by').references('ref_code').inTable('users');
    });
    console.log('User table created');
  }

  const hasRedTable = await knex.schema.hasTable('redirections');
  if (!hasRedTable) {
    await knex.schema.createTable('redirections', (tableBuilder) => {
      tableBuilder.increments('id').primary();
      tableBuilder.string('owner').notNullable();
      tableBuilder.string('source').notNullable();
      tableBuilder.string('destination').notNullable();
      tableBuilder.string('source_title').notNullable();
      tableBuilder.string('destination_title').notNullable();
      tableBuilder.boolean('active').defaultTo(false);

      // Foreign Key
      tableBuilder.foreign('owner', 'redirections_fk0').references('chat_id').inTable('users').onDelete('cascade');
    });
    console.log('redirections table created');
  }

  const hasFiltersTable = await knex.schema.hasTable('filters');
  if (!hasFiltersTable) {
    await knex.schema.createTable('filters', (tableBuilder) => {
      tableBuilder.increments('id').primary();
      tableBuilder.boolean('audio').defaultTo(false);
      tableBuilder.boolean('video').defaultTo(false);
      tableBuilder.boolean('photo').defaultTo(false);
      tableBuilder.boolean('sticker').defaultTo(false);
      tableBuilder.boolean('document').defaultTo(false);
      tableBuilder.boolean('hashtag').defaultTo(false);
      tableBuilder.boolean('link').defaultTo(false);
      tableBuilder.string('contain').defaultTo(false);
      tableBuilder.string('notcontain').defaultTo(false);

      // Foreign Key
      tableBuilder.foreign('id').references('id').inTable('redirections').onDelete('cascade');
    });
    console.log('filters table created');
  }

  const hasTransformationsTable = await knex.schema.hasTable('transformations');
  if (!hasTransformationsTable) {
    await knex.schema.createTable('transformations', (tableBuilder) => {
      tableBuilder.increments('id').primary();
      tableBuilder.integer('redirection_id').notNullable();
      tableBuilder.string('old_phrase').notNullable();
      tableBuilder.string('new_phrase').notNullable();
      tableBuilder.integer('rank').notNullable();

      // Foreign Key
      tableBuilder.foreign('redirection_id').references('id').inTable('transformations').onDelete('cascade');
    });
    console.log('transformations table created');
  }
})();

module.exports = knex;
