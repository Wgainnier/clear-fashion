/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart')
const circlesportswear = require('./eshops/circlesportswear')
let products = [];
let a = [];

//recupere tout les items d'un lien et l'affiche
//A FAIRE : les 2 scrappers circle et Montlimart + stocker et sauvegarder dans un JSON File tout les resultats
//, 'https://www.montlimart.com/101-t-shirts', 'https://www.circlesportswear.com/pages/vetement-running'] 'https://www.dedicatedbrand.com/en/men/news'

async function sandbox (eshop = 'https://www.montlimart.com/101-t-shirts') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    products = await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/news');
    a = await montlimart.scrape('https://www.montlimart.com/101-t-shirts');
    products = products.concat(a)
    a = await circlesportswear.scrape('https://shop.circlesportswear.com/collections/t-shirts-homme') 
    products = products.concat(a)

    console.log(products);
    console.log('done');
    Savefunc(products);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  
}

//rajouter un stockage dans un Json File des 3 marques. 
const [,, eshop] = process.argv;
sandbox(eshop);

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




