import knex from 'knex';
import connection from './connection.mjs';
import seedData from './seedData.json';

const client = knex({ client: 'pg', connection });

const tableDefinitions = {
  volumes: table => {
    table.increments('id').primary();
    table.string('name');
    table.timestamps(true, true);
  },
  networks: table => {
    table.increments('id').primary();
    table.string('name');
    table.timestamps(true, true);
  },
  containers: table => {
    table.increments('id').primary();
    table.string('name');
    table.string('image');
    table.integer('listen').unsigned();
    table.integer('public_listen').unsigned();
    table.string('network');
    table.string('volume');
    table.timestamps(true, true);
  },
};

Promise.all(
  Object.keys(tableDefinitions).map(table =>
    client.schema
      .dropTableIfExists(table)
      .then(_ => client.schema.createTable(table, tableDefinitions[table]))
      .then(_ => client(table).insert(seedData[table]))
  )
).then(_ => {
  process.exit(0);
}, console.dir);