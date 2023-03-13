const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {MongoClient, ObjectId} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://clearfashion:abcde@clearfashion.776670c.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db =  client.db(MONGODB_DB_NAME)
const collection = db.collection('products');
const PORT = 8092;
let search = {};

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

async function find_brand(productId){
    await client.connect()
    let result = await collection.find({ _id: ObjectId(productId) }).toArray();

    return result;
  }

  app.get('/products/search', async (req, res) => { 
  await client.connect()
  const marque = req.query.brand || undefined;
  const price = req.query.price || undefined;
  const limit = parseInt(req.query.limit) || 12;
  if(marque )
  {
    search.marque = marque;
  }
  if (price) {
    search.price = { $lte: parseInt(price) };
  }
  const result = await collection.find(search).limit(limit).toArray();
  
  res.json(result);
});

app.get("/products/:id", async(req,res)=>{
  const prod = await find_brand(req.params.id);
  await client.close()
  res.send(prod)
}
);





