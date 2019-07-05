const knex = require('knex');
const express = require('express');
const connection = require('./connection.js');

const port = process.env.PORT || '3000';
const baseRoute = process.env.BASE_ROUTE || '/api';

const client = knex({ client: 'pg', connection });
const app = express();

['services', 'volumes', 'networks'].map(table => {
  // Get endpoint for all items in table
  app.get(`${baseRoute}/${table}`, (req, res, next) => {
    console.log(`all ${table} requested`);
    client
      .select(['*'])
      .from(table)
      .then(x => {
        console.log(`serving ${x.length} ${table}`);
        return x;
      })
      .then(x => res.json(x))
      .catch(x => next(x));
  });

  // Get endpoint for specific item in table by ID
  app.get(`${baseRoute}/${table}/:id`, (req, res, next) => {
    console.log(`Item with ID ${req.params.id} from ${table} requested`);
    client
      .select(['*'])
      .from(table)
      .where({ id: req.params.id })
      .then(x => x[0])
      .then(x => {
        console.log(`serving item { id: ${x.id}, name: ${x.name} }`);
        return x;
      })
      .then(x => res.json(x))
      .catch(x => next(x));
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
