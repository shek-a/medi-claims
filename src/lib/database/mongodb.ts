import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const username = process.env.MONGODB_USER || '';
const password = process.env.MONGODB_SECRET || '';
const host = process.env.MONGODB_HOST || '';
const databaseName = process.env.MONGODB_DATABASE || 'medi_claims_db';

const uri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=medi-claims`;

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (!username || !password || !host) {
    throw new Error('MONGO_DB_USER, MONGO_DB_SECRET, and MONGO_HOST environment variables are required');
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


