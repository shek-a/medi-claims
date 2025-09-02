import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI || '';
const databaseName = process.env.MONGODB_DATABASE || 'medi_claims_db';

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  db = client.db(databaseName);
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}


