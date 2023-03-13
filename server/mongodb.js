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
          marque: product.marque,
          datescraped: product.datescraped
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

async function insert(){
    await client.connect();
    try{
    const db =  client.db(MONGODB_DB_NAME)
    await db.collection('products').deleteMany({});
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    console.log(result);
    }
    finally{
    await client.close()
    console.log("finish")
    }
};


//find the product with brand dedicatedbrand
const brand = "DedicatedBrand"
var query1 = { marque: brand }
async function find_brand(){
await client.connect()
  try{
    const products = await collection.find(query1).toArray();
    console.log(products)
  }
  finally{
    await client.close()
    console.log("Finish 1 \n")
  }
}

//query to search price under 30

var query2 = { price: { $lt: 30 } }
async function lessprice(){  
  await client.connect()
  try{
    const products = await collection.find(query2).toArray();
    console.log(products)
  }
  finally{
    await client.close()
    console.log("Finish 2 \n")   
    
  }
}

//find all product but sorted it by price

async function sortpriceasc(){
  await client.connect()
  try{
    const products = await collection.find().sort({ price: 1 }).toArray()
    console.log(products)
  }
  finally{
    await client.close()
    console.log("Finish 3 Sort price ascending\n")
    
  }
}

async function sortpricedesc(){
  await client.connect()
  try{
    const products = await collection.find().sort({ price: -1 }).toArray()
    console.log(products)
  }
  finally{
    await client.close()
    console.log("Finish 3 Sort price descending\n")
    
  }
}
async function sortdate(){
    await client.connect()
  try{
    const products = await collection.find().sort({ datescraped: 1 }).toArray()
    console.log(products)
  }
  finally{
    await client.close()
    console.log("Finish 4 sort Date \n")
    
  }
}

async function sortdate2weeks(){
  await client.connect()
try{
  const products = await collection.find({ datescraped: {$lt: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)} }).toArray();
  console.log(products)
}
finally{
  await client.close()
  console.log("Finish 5 print items scraped between today and 2 weeks ago \n")
  process.exit()
}
}



async function start(){
  await insert()
  await find_brand()
  await lessprice()
  await sortpriceasc()
  await sortpricedesc()
  await sortdate()
  await sortdate2weeks()
}

start()