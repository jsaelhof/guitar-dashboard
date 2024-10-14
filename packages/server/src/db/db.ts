import { Db, MongoClient } from "mongodb";

let dbConn: Db | null = null;

const db = async (): Promise<Db> => {
  try {
    if (!dbConn) {
      const connectionString = "mongodb://localhost:27017/guitar";
      const client = new MongoClient(connectionString);
      const conn: MongoClient = await client.connect();
      dbConn = conn.db("guitar");
    }

    return dbConn;
  } catch (e) {
    console.error(e);
    throw "Couldn't connect to DB";
  }
};

export default db;
