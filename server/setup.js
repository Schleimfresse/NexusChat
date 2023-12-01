import { db } from "./config/db.js";

db.run(`
  CREATE TABLE IF NOT EXISTS serverMessages (
    message TEXT,
    uuid TEXT,
    user TEXT,
    created_at DATETIME,
    channel INTEGER
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS directMessages (
    message TEXT,
    uuid TEXT,
    user TEXT,
    created_at DATETIME,
    channel INTEGER
  )
`);

db.run(`
CREATE TABLE IF NOT EXISTS user (
  alias TEXT,
  username TEXT,
  email TEXT,
  password TEXT,
  image TEXT,
  servers ARRAY,
  friends ARRAY
)
`);