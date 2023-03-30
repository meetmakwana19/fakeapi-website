console.log("Working with DOM");

let a = document;
a = document.all; //gives all tags 
a = document.body

console.log(a)

// -----------------

// XMLHttpRequest() is a constructor directly and not a class in JS
// The constructor initializes an XMLHttpRequest. It must be called before any other method calls.
const httpRequest = new XMLHttpRequest()

// function() is a handler and not callback
httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if(httpRequest.status === 200){
            console.log("API Response: ", JSON.parse(httpRequest.responseText));

            // parsing the responseText which is in string means string to JSON
            const productsArray = JSON.parse(httpRequest.responseText)

            productsArray.map(
                function(prod) {
                    productsDiv.appendChild(createProducts(prod))
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

// products

const productsDiv = document.querySelector("#products-grid")

function createProducts(prod){
    const prodDiv = document.createElement("div")
    prodDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "product-div", "p-4", "text-center", "d-flex", "flex-column", "flex-wrap", "align-items-center", "justify-content-between", "border") //"flex-wrap", "align-items-center" are for the img to not distort while being in the center

    prodDiv.innerHTML = `
    <img src="${prod.image}" width="auto" class="mb-4">
    <h5 class="text-start me-auto">${prod.title}</h5>
    <h6 class="me-auto">Rs. ${prod.price}</h6>
    `
    return prodDiv
}

// -------- Nav items

const categories_req = new XMLHttpRequest()

categories_req.onreadystatechange = function(){
    if(categories_req.readyState === XMLHttpRequest.DONE){
        if(categories_req.status === 200){
            console.log("API Response: ", JSON.parse(categories_req.responseText));

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
// console.log(navCollapseDiv);

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