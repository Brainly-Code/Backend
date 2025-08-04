/* eslint-disable prettier/prettier */
import pkg from 'pg';
const { Client } = pkg;


console.log("DATABASE_URL:", process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection failed:', err));
