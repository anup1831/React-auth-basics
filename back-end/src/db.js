import { MongoClient } from 'mongodb'

let client;

export const initializeDbConnection = async () => {
    client = await MongoClient.connect('mongodb+srv://Anupkumar:TataMarch18@cluster0.3clsfrl.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export const getDbConnection = dbName => {
    const db = client.db(dbName);
    return db;
}