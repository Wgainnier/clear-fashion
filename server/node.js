const fs = require('fs');
let products = [];
function getProducts() {
    try {
      const data = fs.readFileSync('products.json', 'utf8');
      const products = JSON.parse(data).map(function(product) {
        return {
          name: product.name,
          price: product.price,
          marque: product.marque
        };
      });
      return products;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
products = getProducts()

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://clearfashion:abcde@clearfashion.776670c.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function insert(){
    await client.connect();
    try{
    const db =  client.db(MONGODB_DB_NAME)
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    console.log(result);
    }
    finally{
    client.close();
    console.log("finish")
    }
};

insert()