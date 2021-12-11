const { Client } = require('pg');

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })


let PG_USER = process.env.PG_USER;
let PG_PASSWORD = process.env.PG_PASSWORD;
let PG_HOST = process.env.PG_HOST;
let PG_PORT = process.env.PG_PORT;
let PG_DATABASE = process.env.PG_DATABASE;

const connectionString = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

const pgClient = new Client({
    connectionString: connectionString
});

module.exports = pgClient;