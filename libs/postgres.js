const { Client } = require('pg')

async function getConnection() {
  const client = new Client({
    user: "admin",
    password: 'admin123',
    host: 'localhost',
    database: 'my_store',
    port: 5432,
  })
  await client.connect();
  return client;
}

module.exports = getConnection;

