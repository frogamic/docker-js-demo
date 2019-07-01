exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('volumes', table => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('networks', table => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),
  ]).then(_ =>
    knex.schema.createTable('services', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('image');
      table.integer('listen').unsigned();
      table.integer('public_listen').unsigned();
      table
        .integer('network_id')
        .unsigned()
        .references('networks.id');
      table
        .integer('volume_id')
        .unsigned()
        .references('volumes.id');
      table.timestamps(true, true);
    })
  );
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('services')
    .then(_ =>
      Promise.all([
        knex.schema.dropTable('volumes'),
        knex.schema.dropTable('networks'),
      ])
    );
};
