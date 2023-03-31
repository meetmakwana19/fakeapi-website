console.log("Working with DOM");

let a = document;
a = document.all; //gives all tags 
a = document.body

console.log(a)

// ----------------- GET all products part : 

// XMLHttpRequest() is a constructor directly and not a class in JS
// The constructor initializes an XMLHttpRequest. It must be called before any other method calls.
const httpRequest = new XMLHttpRequest()

// function() is a handler and not callback
httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            // console.log("API Response: ", JSON.parse(httpRequest.responseText));

            // parsing the responseText which is in string means string to JSON
            const productsArray = JSON.parse(httpRequest.responseText)

            productsArray.map(
                function(prod) {
                    // if condition because using the same JS file for other html page too which doesnt need this function
                    if(productsDiv){
                        productsDiv.appendChild(  createProducts(prod))
                    }
                }
            )
        }
        else{
            alert("Some error occured.")
        }
    }
}


httpRequest.open("GET", "https://fakestoreapi.com/products")
httpRequest.send()

// ---------------- Populating all products on index.html
const productsDiv = document.querySelector("#products-grid")

function createProducts(prod){
    const prodDiv = document.createElement("div")
    prodDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "product-div", "p-4", "text-center", "d-flex", "flex-column", "flex-wrap", "align-items-center", "justify-content-between", "border") //"flex-wrap", "align-items-center" are for the img to not distort while being in the center

    prodDiv.innerHTML = `
    <img src="${prod.image}" width="auto" class="mb-4">
    <h5 class="text-start me-auto">${prod.title}</h5>
    <h6 class="me-auto">Rs. ${prod.price}</h6>

    `
    // --------Redirecting to product page
    prodDiv.addEventListener("click", function(){
        console.log("hello");
        // setting the URL to redirect to   
        window.location.href = "product.html"
    })
    return prodDiv
}

// -------- Nav items
// -------- GET all categories :

const categories_req = new XMLHttpRequest()

categories_req.onreadystatechange = function(){
    if(categories_req.readyState === XMLHttpRequest.DONE){
        if(categories_req.status === 200){
            // console.log("API Response: ", JSON.parse(categories_req.responseText));

            const categoriesArray = JSON.parse(categories_req.responseText)
            console.log("categoriesArray : ",categoriesArray);

            categoriesArray.map(
                function(cats) {
                    navCollapseDiv.appendChild(createNavItems(cats))
                }
            )
        }
        else{
            alert("Some error occured to fetch categories.")
        }
    }
}


const navCollapseDiv = document.querySelector(".collapse")

function createNavItems(cats){
    const navUlEl = document.createElement("ul")
    navUlEl.classList.add("navbar-nav", "me-auto", "mb-2", "mb-lg-0")

    navUlEl.innerHTML = `
    <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">${cats}</a>
    </li>
    `
    // document.getElementById("nav-form").insertAdjacentHTML("beforebegin", navUlEl)

    return navUlEl
}

categories_req.open("GET", "https://fakestoreapi.com/products/categories")
categories_req.send()

// adding search form in BS navbar
const navForm = document.createElement("form")
navForm.classList.add("d-flex")
navForm.setAttribute("role", "search")
navForm.setAttribute("id", "nav-form")
navForm.innerHTML = `
<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
<button class="btn btn-outline-success" type="submit">Search</button>
`
navCollapseDiv.appendChild(navForm)

// ---------------Product page part for product.html:

const productInfo_req = new XMLHttpRequest();

productInfo_req.onreadystatechange = function(){
    if(productInfo_req.readyState === XMLHttpRequest.DONE){
        if(productInfo_req.status === 200){
            console.log("API Respone :", JSON.parse(productInfo_req.responseText));

            const infoArray = JSON.parse(productInfo_req.responseText)

            // infoArray.map(function(prod){
            //     prodContainer.appendChild(createInfo(prod))
            // })
            prodContainer.appendChild(createInfo(infoArray))
        }
        else{
            alert("Some error occured.")
        }
    }
}
productInfo_req.open("GET", "https://fakestoreapi.com/products/1")
productInfo_req.send();

// ---------------- Populating product's info on product.html
const prodContainer = document.querySelector("#prod-container")

function createInfo(prod){
    console.log("creting from", prod);

    const infoPage = document.createElement("section")
    infoPage.classList.add("row")

    infoPage.innerHTML = `
    <p>> ${prod.category.charAt(0).toUpperCase() + prod.category.slice(1)}</p>
    <div class="col-lg-6 text-center border p-5">
        <img src="${prod.image}" width="auto" class="">
    </div>
    <div class="col-lg-6 border p-5">
        <h3>${prod.title}</h3>
        <p>${prod.rating}</p>
        <h6>${prod.price}</h6>
        <p>${prod.description}</p>
    </div>
    `

    return infoPage;
}