import { Db, MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017/guitar";
const client = new MongoClient(connectionString);

let conn: MongoClient;
let db: Db;

try {
  conn = await client.connect();
  db = conn.db("guitar");
} catch (e) {
  console.error(e);
}

export default db;
