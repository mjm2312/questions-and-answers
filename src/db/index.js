const { response } = require('express');
const { Pool } = require('pg');
const params = require('../config');

//console.log('params in db index.js', params);

var config = {
    user: params.pgUser, 
    database: params.pgDB,
    //password: params.pgPassword, 
    host: params.pgHost,
    port: params.pgPort,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

pool.on('connect', function (err, client) {
  console.log('connection successful');
});

module.exports = pool;