// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let recently = ""
let brands = "";

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector("#brand-select")
const spanNbBrand = document.querySelector("#nbBrands")
const selectRecently = document.querySelector("#recently")
const spanNbrecent = document.querySelector("#nbNewProduct")
const selectReasonable = document.querySelector("#reasonable")


const current_date = Date.now();
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

//fetch brands
const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};



/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */


const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  
};

/**
 * Declaration of all Listeners
 */



document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brandsname = await fetchBrands();
  spanNbBrand.innerHTML = brandsname.result.length
  
  //count of the number of recent product:
 
  brandsname.result.unshift("all");
  const brands = Array.from(
    brandsname.result,
    value => `<option value="${value}">${value}</option>`
  ).join('');
  
  selectBrand.innerHTML = brands;

  const all_products = await fetchProducts(1, currentPagination.count);
  spanNbrecent.innerHTML = all_products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60).length;
  

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

// Feature 0 

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 1 :

selectPage.addEventListener('change', async(event) =>{
  const products = await fetchProducts(parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

//Feature 2 :

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (recently == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }
  brands = event.target.value

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


// Feature 3 :

selectRecently.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  console.log(event.target.value)
  if (event.target.value == "Yes") {
    products.result = products.result.filter(product => (current_date >= new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  recently = event.target.value
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

// Feature 4




