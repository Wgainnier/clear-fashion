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
let recently = "Yes"
let brands = "all";
let reasonable = "Yes";
let totalprices = [];
let totalproduct;
let favoritesList =[];
let favorite = "No";
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

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
let selectSort = document.querySelector("#sort-select")
const P50 = document.querySelector("#p50");
const P90 = document.querySelector("#p90");
const P95 = document.querySelector("#p95");
const latestReleaseDate = document.querySelector("#lastdate");
const selectFavorite = document.querySelector("#favorite-select")


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
      //https://clear-fashion-api.vercel.app?page=${page}&size=${size}
      //`https://clear-fashion-alpha-one.vercel.app?page=${page}&size=${size}`
      'https://server-alpha-one.vercel.app/products/search'
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
        <span>${product.released}</span>
        <button onclick="addToFavorites('${product.uuid}')">Add to Favorites</button>
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
  totalproduct = await fetchProducts(1, 48);
  const brandsname = await fetchBrands();
  spanNbBrand.innerHTML = brandsname.result.length
  
  //count of the number of recent product:
 
  brandsname.result.unshift("all");
  const brands = Array.from(
    brandsname.result,
    value => `<option value="${value}">${value}</option>`
  ).join('');
  
  selectBrand.innerHTML = brands;
  // feature 9

  

const productsReleasedWithinTwoWeeks = totalproduct.result.filter(product => {
  const releaseDate = new Date(product.releaseDate);
  return releaseDate >= twoWeeksAgo;
});

  spanNbrecent.innerHTML = productsReleasedWithinTwoWeeks.length;
  
  const totalprices = totalproduct.result.map(product => product.price);

  const last = totalproduct.result.reduce((latestDate, product) => {
    if (product.released > latestDate) {
      return product.released;
    } else {
      return latestDate;
    }
  }, '');
  
  latestReleaseDate.innerHTML = last

  P50.innerHTML = Math.round(quantile(totalprices, 0.50)); 
  P90.innerHTML = Math.round(quantile(totalprices, 0.90)); 
  P95.innerHTML = Math.round(quantile(totalprices, 0.95)); 


  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

// Feature 0 

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (favorite == "Yes") {
    products.result = products.result.filter(product => {
      return favoritesList.includes(product.uuid);
    });
}
  products.result = filtermenu(products,reasonable,recently)
  products.result = sortmenu(products,selectSort)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 1 :

selectPage.addEventListener('change', async(event) =>{
  const products = await fetchProducts(parseInt(event.target.value));
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (favorite == "Yes") {
    products.result = products.result.filter(product => {
      return favoritesList.includes(product.uuid);
    });
}
  products.result = filtermenu(products,reasonable,recently)
  products.result = sortmenu(products,selectSort)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

//Feature 2 :

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (favorite == "Yes") {
    products.result = products.result.filter(product => {
      return favoritesList.includes(product.uuid);
    });
}
  products.result = filtermenu(products,reasonable,recently)
  products.result = sortmenu(products,selectSort)
  brands = event.target.value

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


// Feature 3 :

selectRecently.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  if (event.target.value == "Yes") {
    products.result = products.result.filter(product => (current_date >= new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (reasonable == "Yes") {
    products.result = products.result.filter(product => (product.price <= 50));
  }
  if (favorite == "Yes") {
    products.result = products.result.filter(product => {
      return favoritesList.includes(product.uuid);
    });
}
  products.result = sortmenu(products,selectSort)
  recently = event.target.value
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

// Feature 4 5

selectReasonable.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  if (event.target.value == "Yes") {
    products.result = products.result.filter(product => (product.price <= 50));
  }
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (recently == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }
  if (favorite == "Yes") {
      products.result = products.result.filter(product => {
        return favoritesList.includes(product.uuid);
      });
  }
  products.result = sortmenu(products,selectSort)
  
  reasonable = event.target.value
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectFavorite.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  if (event.target.value == "Yes") {
      products.result = products.result.filter(product => {
        return favoritesList.includes(product.uuid);
      });
    }
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  products.result = filtermenu(products,reasonable,recently)
  products.result = sortmenu(products,selectSort)
  
  favorite = event.target.value
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


selectSort.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  if (brands != "all") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }
  if (favorite == "Yes") {
    products.result = products.result.filter(product => {
      return favoritesList.includes(product.uuid);
    });
}
  products.result = filtermenu(products,reasonable,recently)
  products.result = sortmenu(products,selectSort)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

function sortmenu(products, selectSort){
  if(selectSort.value == "price-asc")
  {
    products.result = products.result.sort((a,b) => a.price - b.price);
  }
  if(selectSort.value == "price-desc")
  {
    products.result = products.result.sort((a,b) => b.price - a.price);
  }
  if(selectSort.value == "date-asc")
  {
    products.result = products.result.sort((a,b) => new Date(b.released) - new Date(a.released))
  }
  if(selectSort.value == "date-desc")
  {
    products.result = products.result.sort((a,b) => new Date(a.released) - new Date(b.released))
  }
  return products.result
}

function filtermenu(products,reasonable,recent){
  if (recent == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }
  if (reasonable == "Yes") {
    products.result = products.result.filter(product => (product.price <= 50));
  }

  return products.result
}

function addToFavorites(product) {
  
  favoritesList.push(product);
  
}

const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
  const sorted = asc(arr);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
      return sorted[base];
  }
};










