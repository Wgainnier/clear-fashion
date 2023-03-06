/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart')
const circlesportswear = require('./eshops/circlesportswear')
let products = [];
let a = [];

async function sandbox () {
  try {
    console.log(`🕵️‍♀️  browsing Montlimart circlesportswear and dedicatedbrand eshop`);

    products = await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/news');
    a = await montlimart.scrape('https://www.montlimart.com/101-t-shirts');
    products = products.concat(a)
    a = await circlesportswear.scrape('https://shop.circlesportswear.com/collections/t-shirts-homme') 
    products = products.concat(a)

    console.log(products);
    console.log('done');
    Savefunc(products);
    return products
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  
}

const [,, eshop] = process.argv;
sandbox();

function Savefunc(products)
{
const chemin = 'products.json';
const fs = require('fs');
const jsonData = JSON.stringify(products, null, 2);
fs.writeFileSync('products.json', jsonData, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});
}




