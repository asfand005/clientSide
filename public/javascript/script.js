// API Base URL - the server address
const BASE_URL = 'http://localhost:8080';

// Default HTTP headers for requests to the api
const HTTP_REQ_HEADERS = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json"
});

// Used to Initialise GET requests and permit cross origin requests
const GET_INIT = {
    method: 'GET',
    credentials: 'include',
    headers: HTTP_REQ_HEADERS,
    mode: 'cors',
    cache: 'default'
};


// get data from api 

const getDataAsync = async (url, init = GET_INIT) => {
    try {
        const response = await fetch(url, init);
        const json = await response.json();
        // console.log(json);
        return json;
    } catch (e) {
        console.log(e);
        return e;
    }
}

// display one product funciton 
const displayProduct = async (prodId) => {
    try {
        let product = await getDataAsync(`${BASE_URL}/product/${prodId}`);

        // returns a template string for each product, values are inserted using ${ }
        // <tr> is a table row and <td> a table division represents a column
        // product_price is converted to a Number value and displayed with two decimal places
        let row = `<tr>
                      <td>${product._id}</td>
                      <td>${product.name}</td>
                      <td>${product.description}</td>
                      <td class="price">&euro;${Number(product.price).toFixed(2)}</td>
                    </tr>`;

        return document.getElementById('product').innerHTML = row;

    } catch (e) {
        console.log(e);
        return e;
    }


}




// 1. Parse JSON
// 2. Create product rows
// 3. Display in web page
let displayProducts = (products) => {
    // Use the Array map method to iterate through the array of products (in json format)
    // Each products will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="productRows"> element.

    const rows = products.map((product) => {
        // returns a template string for each product, values are inserted using ${ }
        // <tr> is a table row and <td> a table division represents a column
        // product_price is converted to a Number value and displayed with two decimal places

        let row = `<tr>
                  <td>${product._id}</td>
                  <td onclick="displayProduct(${product._id})"><a href="#" class="w-100 btn text-light bg-dark">${product.name}</a></td>
                  <td>${product.description}</td>
                  <td class="price">&euro;${Number(product.price).toFixed(2)}</td>
                  </tr>`;

        return row;
    });
    // Set the innerHTML of the productRows root element = rows
    // join('') converts the rows array to a string, replacing the ',' delimiter with '' (blank)
    document.getElementById('productRows').innerHTML = rows.join('');
} // end function



// this is to display all categoreis by button which is All categories. 
const displayAll = document.querySelector("#allCat");
displayAll.addEventListener("click", () => {
    loadProducts();
})



// this function is for display category products .
// this takes an id as a parameter 
const loadProduct = async (id) => {
    try {
        let catById = await getDataAsync(`${BASE_URL}/bycat/${id}`);
        // to get the category.products array.

        const categoryProducts = await catById.map((category) => {
            const result = [...category.products];
            return result;
        })

        const category = await categoryProducts.forEach((products) => {
            for (let product of products) {
                displayProducts(products);
            }
        })
    } catch (e) {
        console.log(e);
    }
}

let displayCategories = async (categories) => {
    try {
        const cat = await categories.map((category) => {
            const row = `
            <a href="#" class="list-group-item list-group-item-action" onclick="loadProduct(${category._id})">${category.name}</a> `
            return row;
        });
        document.getElementById('categoryList').innerHTML = cat.join(" ");

    } catch (e) {
        console.log(e);
        return e;
    }
} // end function


// function to get the categories 


// Load Products
// Get all categories and products then display
let loadProducts = async () => {
    try {
        // get data - note only one parameter in function call
        let products = await getDataAsync(`${BASE_URL}/product`);
        //pass json data for display
        displayProducts(products);
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}


let loadCategories = async () => {
    try {
        let categories = await getDataAsync(`${BASE_URL}/bycat`);
        await displayCategories(categories);
    } catch (e) {
        console.log(e);
    }
}


// When this script is loaded, get things started by calling loadProducts()
loadProducts();
loadCategories();
