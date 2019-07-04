const data = require('./service-network-volume.json');

exports.seed = knex => {
  const createService = async service => ({
    ...service,
    network_id: service.network_id
      ? (await knex('networks')
          .select('id')
          .where({ name: service.network_id })
          .first()).id
      : undefined,
    volume_id: service.volume_id
      ? (await knex('volumes')
          .select('id')
          .where({ name: service.volume_id })
          .first()).id
      : undefined,
  });

  // Deletes ALL existing entries
  return knex('services')
    .del()
    .then(_ =>
      Promise.all(
        ['networks', 'volumes'].map(table =>
          knex(table)
            .del()
            .then(() => knex(table).insert(data[table]))
        )
      ).then(async _ =>
        knex('services').insert(
          await Promise.all(data.services.map(createService))
        )
      )
    );
};
