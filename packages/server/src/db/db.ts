import { Db, MongoClient } from "mongodb";

let dbConn: Db | null = null;

const db = async (): Promise<Db> => {
  try {
    if (!dbConn) {
      const client = new MongoClient(process.env.CONNECTION_STRING ?? "");
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
