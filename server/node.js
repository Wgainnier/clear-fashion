const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://clearfashion:abcde@clearfashion.776670c.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
let products = [];

async function listDatabases(){
    products = sandbox()
    

 
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)
    const collection = db.collection('products');
    const result = collection.insertMany(products);
    console.log(result);
    await client.close();
    console.log("finish")
};

listDatabases()