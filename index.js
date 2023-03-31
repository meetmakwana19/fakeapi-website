console.log("Working with DOM");

let a = document;
a = document.all; //gives all tags 
a = document.body

console.log(a)

let product_id;

// ************index.html part*******************

// ----------------- GET all products part : 

// XMLHttpRequest() is a constructor directly and not a class in JS
// The constructor initializes an XMLHttpRequest. It must be called before any other method calls.
const getAllProdsReq = new XMLHttpRequest()

// function() is a handler and not callback
getAllProdsReq.onreadystatechange = function(){
    if(getAllProdsReq.readyState === XMLHttpRequest.DONE){
        if(getAllProdsReq.status === 200){
            // console.log("API Response: ", JSON.parse(getAllProdsReq.responseText));

            // parsing the responseText which is in string means string to JSON
            const productsArray = JSON.parse(getAllProdsReq.responseText)

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


getAllProdsReq.open("GET", "https://fakestoreapi.com/products")
getAllProdsReq.send()

// ---------------- Populating all products on index.html
const productsDiv = document.querySelector("#products-grid")

function createProducts(prod){
    const prodDiv = document.createElement("div")
    prodDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "product-div", "p-4", "text-center", "d-flex", "flex-column", "flex-wrap", "align-items-center", "justify-content-between", "border") //"flex-wrap", "align-items-center" are for the img to not distort while being in the center

    prodDiv.innerHTML = `
    <img src="${prod.image}" width="auto" class="mb-4">
    <h5 class="text-start me-auto">${prod.title}</h5>
    <h6 class="me-auto">Rs. ${prod.price}</h6>
    <p>${prod.id}</p>
    `
    // --------Redirecting to product page
    prodDiv.addEventListener("click", function(){
        // saving product id in localstorage as when product.html is redirected, a new instance of javascript is genrated where the id info gets lost.
        // So to avoid loss of id, saving it in local storage
        localStorage.setItem("product_id", prod.id)

        // setting the URL to redirect to   
        window.location.href = "product.html" 
    })
    return prodDiv
}

// *****************Navbar********************

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

// ***************product.html part************

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
            if(prodContainer){
                prodContainer.appendChild(createInfo(infoArray))
            }
        }
        else{
            alert("Some error occured.")
        }
    }
}

// productInfo_req.open("GET", "https://fakestoreapi.com/products/1")

// console.log("gettid id is --->", localStorage.getItem("product_id"));
productInfo_req.open("GET", `https://fakestoreapi.com/products/${localStorage.getItem("product_id")}`)
productInfo_req.send();
    
// ---------------- Populating product's info on product.html
const prodContainer = document.querySelector("#prod-container")
    
function createInfo(prod){
    console.log("creting from", prod);
    
    const infoPage = document.createElement("section")
    infoPage.classList.add("row")

    // ****Formatting of raw description string
    // Split the description by full stops and Remove empty elements from the array
    const sentences = prod.description.split(".").filter(sentence => sentence.trim() !== ""); 
    // Wrap each sentence in an HTML list item
    const listItems = sentences.map(sentence => `<li>${sentence}</li>`)
    // Join the list items and wrap them in an HTML unordered list
    const bulletList = `<ul>${listItems.join("")}</ul>`

    infoPage.innerHTML = `
    <strong class="mb-4">> ${prod.category.charAt(0).toUpperCase() + prod.category.slice(1)}</strong>

    <div class="col-lg-6 text-center p-5">
        <img src="${prod.image}" width="auto" class="">
    </div>

    <div class="col-lg-6 p-5">
        <h3>${prod.title}</h3>
        <div class="rating d-flex border justify-content-evenly">
            <div id="rating-div">${prod.rating.rate} <i class="bi bi-star-fill"></i></div>
            <span>|</span>
            <div id="rating-count">
                ${prod.rating.count} Ratings
            </div>
        </div>
        <hr>
        <h3 class="d-inline"><span>₹</span></h3>
        <h4 class="d-inline">${prod.price}</h4>
        <hr>
        <h6>PRODUCT DETAILS <i class="bi bi-card-text"></i></h6>
        ${bulletList}
    </div>
    `
    return infoPage;
}
