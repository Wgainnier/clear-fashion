const fs = require('fs');
let products = [];

// retrieve products from the products scraped in the previous TP (dedicatedbrand montlimart and circlesportswear)
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
const db =  client.db(MONGODB_DB_NAME)
const collection = db.collection('products');


//Do this for the insertion of the products in mongodb
/*
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
*/

const brand = "DedicatedBrand"
var query1 = { marque: brand }
async function find_brand(){
  await client.connect();
  try{
    const products = await collection.find(query1).toArray();
    console.log(products)
  }
  finally{
    
    console.log("Finish 1 \n")
  }
}

//query to search price under 30

var query2 = { price: { $lt: 30 } }
async function lessprice(){  
  try{
    const products = await collection.find(query2).toArray();
    console.log(products)
  }
  finally{
    
    console.log("Finish 2 \n")   
    
  }
}

//find all product but sorted it by price

async function sortprice(){
  try{
    const products = await collection.find().sort({ price: 1 }).toArray()
    console.log(products)
  }
  finally{
    client.close()
    console.log("Finish 3 \n")
    process.exit()
  }
}

find_brand()
lessprice()
sortprice()

