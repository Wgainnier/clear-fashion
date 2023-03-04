const fetch = require('node-fetch');
const cheerio = require('cheerio');
const marque =  "CircleSportsWear"
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  return $('.grid__item')
    .map((i, element) => {
      let name = $(element)
        .find('.card__heading')
        .text()
        .trim()
        .replace(/\s/g, ' ');
        name = name.slice(0, 50);
        name = name.trim()
      const price = parseInt(
        $(element)
          .find('.money')
          .text()
          .slice(1)
      );
      return {name, price, marque};
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
