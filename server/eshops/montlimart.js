const fetch = require('node-fetch');
const cheerio = require('cheerio');
const marque = 'Montlimart'
const datescraped = new Date()

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
 
  return $('.products-list .products-list__block.products-list__block--grid')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      return {name, price, marque, datescraped};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */


module.exports.scrape = async url => {
  try {   
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
