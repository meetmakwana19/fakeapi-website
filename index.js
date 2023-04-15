console.log("Working with DOM");

let a = document;
a = document.all; //gives all tags
a = document.body;

console.log(a);

// Using this keyword while redirecting to product page
let product_id;

// *****************Navbar********************
// common to all pages as all pages share same JS file
const navbar = document.createElement("nav")
navbar.classList.add("navbar", "navbar-expand-lg", "bg-body-tertiary", "sticky-top")
navbar.innerHTML = `
<div class="container-fluid">
<a class="navbar-brand" href="index.html">
  <img src="./public/myntra.png" alt="logo">
  Mytra</a>
<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
  data-bs-target="#navbarSupportedContent"
  aria-controls="navbarSupportedContent" aria-expanded="false"
  aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse mx-4" id="navbarSupportedContent">
</div>
</div>
`

// adding navbar as the first child of the body to make navbar on the top of body
const body = document.body
body.insertBefore(navbar, body.firstChild)

const alertDiv = document.createElement("div")
alertDiv.setAttribute("id", "liveAlertPlaceholder")

//  Adding the child(alertDiv) element as the second child of the parent element(body) to make the alert appear under the navbar
body.insertBefore(alertDiv, body.childNodes[1])

// -------- Nav items

// -------- GET all categories :

const categories_req = new XMLHttpRequest();

categories_req.onreadystatechange = function () {
  if (categories_req.readyState === XMLHttpRequest.DONE) {
    if (categories_req.status === 200) {
      // console.log("API Response: ", JSON.parse(categories_req.responseText));

      const categoriesArray = JSON.parse(categories_req.responseText);
      console.log("categoriesArray : ", categoriesArray);

      categoriesArray.map(function (cats) {
        navCollapseDiv.appendChild(createNavItems(cats));
      });
      // *imp : append the searchbar here after the categories are fetched and populated from API otherwise due to JS Async nature, the searchbar will be rendered first.
      navCollapseDiv.appendChild(navForm);
      navCollapseDiv.appendChild(navIcons);
    } else {
      alert("Some error occured to fetch categories.");
    }
  }
};

const navCollapseDiv = document.querySelector(".collapse");
const navUlEl = document.createElement("ul");
navUlEl.classList.add("navbar-nav", "me-auto", "mb-2", "mb-lg-0");

// to populate the categorywise products on index.html itself instead of some other html page.
function catProducts(category) {
  // console.log("checking this : ", this);

  // console.log("category element = ", category);

  // console.log("category is here ", category.getAttribute("data-category"));

  // setting the recieved parameter from div element to the value of category. 
  category = category.getAttribute("data-category")

  // IGNORE : this localstorage was used to make dynamic link for the prodycts_category.html but commenting it away as it is not getting used anymore
  // localStorage.setItem("cat_link", category);

  // IGNORE :
  // window.location.href = "products_category.html";
  // const element = document.getElementById(`#${link}`);
  // localStorage.setItem("cat_link", element.id);
  // setTimeout(() => {
  // }, 1000);
  // event.preventDefault();  
  // return false;

  // CONTINUE :
  // to remove the div of products which were  populated by all products request on the index.html
  const allProdDiv1 = document.querySelector("#allProdDiv")
  if (allProdDiv1) {
    allProdDiv1.parentNode.removeChild(allProdDiv1)
  }
  // to remove the div of products which could have been populated by previous category request
  const categoryProdDiv1 = document.querySelector("#categoryProdDiv")
  if (categoryProdDiv1) {
    categoryProdDiv1.remove()
  }
  // removing carousel 
  const carousel = document.querySelector("#carouselExample")
  if (carousel) {
    carousel.remove()
  }
  // updating H1
  const mainh1 = document.querySelector(".prod-h")
  if (mainh1) {
    mainh1.innerHTML = category.charAt(0).toUpperCase() + category.slice(1) + " Products"
  }

  // making the div for catgorical products
  const categoryProdDiv = document.createElement("div");
  categoryProdDiv.setAttribute("id", "categoryProdDiv");
  categoryProdDiv.classList.add("row", "g-4")

  const getCatProdReq = new XMLHttpRequest()

  getCatProdReq.onreadystatechange = function () {
    if (getCatProdReq.readyState === XMLHttpRequest.DONE) {
      if (getCatProdReq.status === 200) {
        const productsArray = JSON.parse(getCatProdReq.responseText)
        productsArray.map(function (prod) {
          if (categoryProdDiv) {
            categoryProdDiv.appendChild(createProducts(prod))
          }
        })
      }
      else {
        alert("Some error occured.")
      }
    }
  }
  // making the link dynamic
  getCatProdReq.open("GET", "https://fakestoreapi.com/products/category/"+ category)
  getCatProdReq.send()

  // putting the created categoryProdDiv under the main productsDiv
  if (categoryProdDiv) {
    productsDiv.appendChild(categoryProdDiv)
  }
}

// IGNORE : making a base url to fetch products category wise
// let category_product_url = "https://fakestoreapi.com/products/category/";

function createNavItems(cats) {
  const liEl = document.createElement("li");
  liEl.classList.add("nav-item");

  // IGNORE :
  // const new_link = category_product_url + cats;

  // console.log("Categories fetched with apostrophe: ", cats);

  // onclick function is imp to populate categorywise products on index.html itself

  // data-category is a custom data-* Attribute for the HTML element to store custom data which would be private to the web page only.
  // Passing the category value by wrapping it in encodeURI() which helps convert a URL string into a format that can be used as a valid URL. 
  // It does this by encoding certain characters in the URL string that have special meanings in URLs, such as spaces, apostrophes, and other special characters.
  // URL string like /men's clothing, which contains an apostrophe and a space, can use the encodeURI() function to convert it into a URL string like /men's%20clothing, where the apostrophe has been left intact but the space has been replaced with %20.
  // Now URL parsing wont have any issues 
  liEl.innerHTML = `
    <div 
      data-category=${encodeURI(cats)}
    class="nav-link active" onclick=catProducts(this) role="button">${cats.charAt(0).toUpperCase() + cats.slice(1)}</div>`;
    // passing (this) as a parameter in an event handler function is a common way to access the properties and methods of the element that triggered the event. 
    // It allows you to write generic event handler functions that can be reused for multiple elements, rather than writing a separate function for each element.
    // So whole <div> is passed as parameter upon which getAttribute("data-category") can be used to retrive the category value.

  navUlEl.appendChild(liEl);
  return navUlEl;
}

// to fetch categories for the nav-links
categories_req.open("GET", "https://fakestoreapi.com/products/categories");
categories_req.send();

// adding search form in BS navbar
const navForm = document.createElement("form");
navForm.classList.add("d-flex");
navForm.setAttribute("role", "search");
navForm.setAttribute("id", "nav-form");
navForm.innerHTML = `
<input class="form-control me-2" type="search" placeholder="Search for products" aria-label="Search">
<button class="btn btn-outline-success" type="submit">Search</button>
`;

// IGNORE :
// no need of popper
// const popoverTriggerList = document.querySelectorAll(
//   '[data-bs-toggle="popover"]'
// );
// const popoverList = [...popoverTriggerList].map(
//   (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
// );

// CONTINUE :
// creation of moda div for login 
const loginModal = document.createElement("div")
loginModal.classList.add("modal", "fade")
loginModal.setAttribute("id", "login-modal");
loginModal.setAttribute("tabindex", "-1");
loginModal.setAttribute("aria-labelledby", "exampleModalLabel");
loginModal.setAttribute("aria-hidden", "true");
loginModal.innerHTML = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="loginModalLabel">User Sign in</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <form class="loginForm">
        <div class="mb-3">
          <label for="exampleInputusername1" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" aria-describedby="usernameHelp" autocomplete="username">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" autocomplete="current-password">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</div>
`
// *very imp :
// append modal container to the body tag directly so that it doesnt interfere with other elements. 
// appending modal to any element which has fixed/relative position will cause back-drop of whole page
body.appendChild(loginModal);

// a part of navbar
const navIcons = document.createElement("div");
navIcons.classList.add("nav-icons", "d-flex", "align-items-center");
navIcons.innerHTML = `
<div class="dropdown">
  <div id="profileDiv" class="d-flex flex-column text-center mx-4" onclick="login()" type="button" data-bs-toggle="modal" data-bs-target="#login-modal">
      <i class="bi bi-person"></i>
      <p class="username m-0">${localStorage.getItem("username") ? localStorage.getItem("username") : "Profile"}</p>
      <ul class="dropdown-menu user-dropdown">
      <li><p class="dropdown-item" id="fullname">Full name</p></li>
      <li><p class="dropdown-item" id="useremail">email</p></li>
      <li><p class="dropdown-item" id="phone">Phone</p></li>
      <li><p class="dropdown-item" id="address">Address</p></li>
      <li><p class="dropdown-item text-danger" id="logout" onclick="logMeOut()">Logout</p></li>
    </ul>
  </div>
</div>

<div class="d-flex flex-column text-center mx-4">
    <i class="bi bi-heart"></i>
    <p class="m-0">Wishlist</p>
</div>

<div class="d-flex flex-column text-center mx-4 position-relative" type="button">
    <i class="bi bi-handbag"></i>
    <p>Bag</p>
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    ${localStorage.getItem("cartCount") ? localStorage.getItem("cartCount") : "99+"} 
    <span class="visually-hidden">unread messages</span>
  </span>
</div>
<a class="d-flex flex-column text-center mx-4" href="dashboard.html">
    <i class="bi bi-person-bounding-box"></i>
    <p class="mb-0">Admin</p>
</a>
`;

// For global use of alert under the navbar
// -----Alert
const alertPlaceholder = document.getElementById(
  "liveAlertPlaceholder"
);
const alert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center fixed-top z-3" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  alertPlaceholder.append(wrapper);
};

// ---------------- GET user info 

let userObj = {};
const user = localStorage.getItem("username");
const getUserInfo = new XMLHttpRequest()

getUserInfo.onreadystatechange = function () {
  if (getUserInfo.readyState === XMLHttpRequest.DONE) {
    if (getUserInfo.status === 200) {
      console.log("users : ", JSON.parse(getUserInfo.responseText));

      const usersArray = JSON.parse(getUserInfo.responseText)
      const user = localStorage.getItem("username");
      userObj = usersArray.find((element) => {
        console.log("fetched user is ", element);
        return element.username === user;
      })
      document.querySelector("#fullname").innerHTML = `${userObj.name.firstname.toUpperCase()} ${userObj.name.lastname.toUpperCase()}`

      document.querySelector("#useremail").innerHTML = `${userObj.email}`

      document.querySelector("#phone").innerHTML = `${userObj.phone}`

      document.querySelector("#address").innerHTML = `Address : ${userObj.address.number}, ${userObj.address.street}, ${userObj.address.city}, ${userObj.address.zipcode}.`
    }
    else {
      alert("Some error occured")
    }
  }
}

// open and send() requests are in the login()
// ----------------GET User cart info 
// https://fakestoreapi.com/carts/user/3
// ***** The api is not configured properly 


// ************index.html part*******************

// ----------------- GET all products part :

const mainProductsDiv = document.getElementById("products")

const mainH1 = document.createElement("h1")
mainH1.classList.add("prod-h", "d-flex", "justify-content-between")
mainH1.innerHTML = `
Best Buys
          <div class="dropdown ">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Limit by
            </button>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li onclick="limitProd(5)"><div class="dropdown-item five">5</div></li>
              <li onclick="limitProd(10)"><div class="dropdown-item ten">10</div></li>
              <li onclick="limitProd(15)"><div class="dropdown-item fifteen">15</div></li>
              <li><hr class="dropdown-divider"></li>
              <li onclick=""><a href="index.html" class="dropdown-item all active">All</a></li>

            </ul>
          </div>`

// if condition to prevent errors on other HTML pages which tries to appendChild
if (mainProductsDiv) {
  mainProductsDiv.appendChild(mainH1)
}

// const productsDiv = document.querySelector("#products-grid");
const productsDiv = document.createElement("div");
productsDiv.setAttribute("id", "products-grid")

// if condition to prevent errors on other HTML pages which tries to appendChild
if (mainProductsDiv) {
  mainProductsDiv.appendChild(productsDiv)
}

const dashboardContainer = document.querySelector("#dashboard-container");

if (productsDiv || dashboardContainer) {
  // XMLHttpRequest() is a constructor directly and not a class in JS 
  // The constructor initializes an XMLHttpRequest. It must be called before any other method calls.
  const getAllProdsReq = new XMLHttpRequest();

  // function() is a handler and not callback
  getAllProdsReq.onreadystatechange = function () {
    if (getAllProdsReq.readyState === XMLHttpRequest.DONE) {
      if (getAllProdsReq.status === 200) {
        console.log("API Response: ", JSON.parse(getAllProdsReq.responseText));

        // parsing the responseText which is in string means string to JSON
        const productsArray = JSON.parse(getAllProdsReq.responseText);

        productsArray.map(function (prod) {
          // if condition because using the same JS file for other html page too which doesnt need this function
          if (allProdDiv) {
            allProdDiv.appendChild(createProducts(prod));
          }
          if (tbody) {
            tbody.appendChild(createTable(prod));
          }
        });
      } else {
        alert("Some error occured.");
      }
    }
  };

  getAllProdsReq.open("GET", "https://fakestoreapi.com/products");
  getAllProdsReq.send();
}
// ---------------- Populating all products on index.html

// not using cartCount & incrementCart() currently
let cartCount = 0;
function incrementCart() {
  newCount = cartCount++;
  localStorage.setItem("cartCount", newCount);
  // console.log("hello");
}
const allProdDiv = document.createElement("div");
allProdDiv.setAttribute("id", "allProdDiv");
allProdDiv.classList.add("row", "g-4")

function createProducts(prod) {
  const prodDiv = document.createElement("div");
  prodDiv.classList.add(
    "col-lg-3",
    "col-md-4",
    "col-sm-6",
    "product-div",
    "p-4",
    "text-center",
    "d-flex",
    "flex-column",
    "flex-wrap",
    "align-items-center",
    "justify-content-between"
  ); //"flex-wrap", "align-items-center" are for the img to not distort while being in the center

  prodDiv.innerHTML = `
    <img src="${prod.image}" width="auto" class="mb-4">
    <h5 class="text-start me-auto">${prod.title}</h5>
    <h6 class="me-auto">Rs. ${prod.price}</h6>
    `;
    
  // IGNORE :
  // <button type="button" class="btn btn-secondary ms-auto" onclick="incrementCart()">Add to cart <i class="bi bi-bag-plus"></i></button>

  // CONTNUE :
  // --------Redirecting to product page
  prodDiv.addEventListener("click", function () {
    // saving product id in localstorage as when product.html is redirected, a new instance of javascript is genrated where the id info gets lost.
    // So to avoid loss of id, saving it in local storage
    localStorage.setItem("product_id", prod.id);

    // setting the URL to redirect to
    window.location.href = "product.html";
  });
  return prodDiv;
}
if (allProdDiv) {
  productsDiv.appendChild(allProdDiv)
}

// ***************product.html part************

// ---------------Product page part for product.html:

const productInfo_req = new XMLHttpRequest();

productInfo_req.onreadystatechange = function () {
  if (productInfo_req.readyState === XMLHttpRequest.DONE) {
    if (productInfo_req.status === 200) {
      // console.log("API Respone :", JSON.parse(productInfo_req.responseText));

      const infoArray = JSON.parse(productInfo_req.responseText);

      // infoArray.map(function(prod){
      //     prodContainer.appendChild(createInfo(prod))
      // })
      if (prodContainer) {
        prodContainer.appendChild(createInfo(infoArray));
      }
    } else {
      alert("Some error occured.");
    }
  }
};

// productInfo_req.open("GET", "https://fakestoreapi.com/products/1")

// console.log("gettid id is --->", localStorage.getItem("product_id"));
productInfo_req.open(
  "GET",
  `https://fakestoreapi.com/products/${localStorage.getItem("product_id")}`
);
productInfo_req.send();

// ---------------- Populating product's info on product.html
const prodContainer = document.querySelector("#prod-container");

function createInfo(prod) {
  console.log("creting from", prod);

  const infoPage = document.createElement("section");
  infoPage.classList.add("row");

  // ****Formatting of raw description string
  // Split the description by full stops and Remove empty elements from the array
  const sentences = prod.description
    .split(".")
    .filter((sentence) => sentence.trim() !== "");
  // Wrap each sentence in an HTML list item
  const listItems = sentences.map((sentence) => `<li>${sentence}</li>`);
  // Join the list items and wrap them in an HTML unordered list
  const bulletList = `<ul>${listItems.join("")}</ul>`;

  infoPage.innerHTML = `
    <strong class="mb-4">> ${prod.category.charAt(0).toUpperCase() + prod.category.slice(1)
    }</strong>

    <div class="col-lg-6 text-center p-5">
        <img src="${prod.image}" width="auto" class="">
    </div>

    <div class="col-lg-6 p-5">
        <h3>${prod.title}</h3>
        <div class="rating d-flex border justify-content-evenly">
            <div id="rating-div">${prod.rating.rate
    } <i class="bi bi-star-fill"></i></div>
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
    `;
  return infoPage;
}

// ***************dashboard.html part************

// const dashboardContainer = document.querySelector("#dashboard-container");

const h2 = document.createElement("h2");
h2.innerHTML = `Mytra Dashboard <hr/>`;

const h4 = document.createElement("h4");
h4.classList.add("float-end", "p-3", "my-4");
h4.setAttribute("type", "button");
h4.setAttribute("data-bs-toggle", "modal");
h4.setAttribute("data-bs-target", "#post-modal");
h4.innerHTML = `
Add a product <i class="bi bi-plus-circle-fill"></i>`;

// Modal for adding a product :

const modalDiv = document.createElement("div");
modalDiv.classList.add("modal", "fade");
modalDiv.setAttribute("id", "post-modal");
modalDiv.setAttribute("tabindex", "-1");
modalDiv.setAttribute("aria-labelledby", "exampleModalLabel");
modalDiv.setAttribute("aria-hidden", "true");

modalDiv.innerHTML = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">Add a Product</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal"
        aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <form id="productForm">
        <div class="form mb-3">
          <label class="form-label">Data object in JSON form</label>
          <textarea class="form-control" id="data" style="height: 100px"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

          <button type="button" class="btn btn-primary" id="liveAlertBtn" onclick="addProduct()">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>`;

// Table to show product data : 

const table = document.createElement("table");
table.classList.add("table", "table-hover", "table-borderless", "my-5");

const thead = document.createElement("thead");
const tr = document.createElement("tr");
tr.innerHTML = `
<th scope="col"></th>
<th scope="col" style="width: 50%;">Product Title</th>
<th scope="col">Preview</th>
<th scope="col">Action</th>
`;
const tbody = document.createElement("tbody");

thead.appendChild(tr);
// tbody.appendChild(trBody)

table.appendChild(thead);
table.appendChild(tbody);

if (dashboardContainer) {
  dashboardContainer.appendChild(h2);
  dashboardContainer.appendChild(h4);
  dashboardContainer.appendChild(modalDiv);
  dashboardContainer.appendChild(table);
}

// dashboard.html also has update modal as td elements has edit icon
function createTable(prod) {
  const trBody = document.createElement("tr");

  trBody.innerHTML = `
    <th scope="row">${prod.id}</th>
    <td>${prod.title}</td>
    <td><img src="${prod.image}"></td>
    <td class="edit-icon"><i class="bi bi-pencil-square" type="button" data-bs-toggle="modal" data-bs-target="#update-modal" onclick = "setEditId(${prod.id})"></i>

    <!-- Modal -->
    <div class="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Update a Product</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="updateForm">
          <div class="form mb-3">
            <label class="form-label">Data object in JSON form</label>
            <textarea class="form-control" id="updated-data" style="height: 100px"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="updateProduct(event)">Update</button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div> | <i class="bi bi-trash3" onclick="deleteProduct(event)" id="${prod.id}"></i> </td>
    `;
  return trBody;
}

// **************POST product
function addProduct() {
  const postPayload = document.getElementById("data").value;
  // create product object
  const payload = { postPayload };

  // Send product data to fake store API using XMLHttpRequest()
  const postProduct = new XMLHttpRequest();
  postProduct.open("POST", "https://fakestoreapi.com/products");
  postProduct.setRequestHeader("Content-Type", "application/json");

  postProduct.onreadystatechange = function () {
    if (postProduct.readyState === XMLHttpRequest.DONE) {
      if (postProduct.status === 200) {
        // console.log("onClick success. Posting product : ",postProduct.responseText); // Display API response in console
        const response = JSON.parse(postProduct.responseText);

        alert(
          `Success <strong>${postProduct.status}</strong> ! Added Product. ID: ${response.id}`,
          "success"
        );

        // Reset form and close modal
        document.getElementById("productForm").reset();
        $("#post-modal").modal("hide");

        // ---------remove the alert after some time
        var alertElement = document.querySelector(".alert");
        // delay the execution of the function that will hide the alert by 3 seconds
        // even if there exists any multiple alerts which were added by multiple button clicks then handling their deletion here
        setTimeout(function () {
          alertElement.remove();
        }, 3000);
      } else {
        console.error(postProduct.statusText);
      }
    }
  };
  postProduct.send(JSON.stringify(payload));
}

// **************Update product using PUT
function setEditId(idx) {
  localStorage.setItem("id_for_update", idx);
}
function updateProduct(event) {
  // has saved the id of the product as the id of the trash icon while populating the table data.
  const idx = localStorage.getItem("id_for_update");
  console.log("idx is-- ", idx);
  const updatePayload = document.getElementById("updated-data").value;
  const payload = { updatePayload };

  const updateReq = new XMLHttpRequest();
  updateReq.open("PUT", `https://fakestoreapi.com/products/${idx}`);
  updateReq.setRequestHeader("Content-Type", "application/json");

  updateReq.onreadystatechange = function () {
    if (updateReq.readyState === XMLHttpRequest.DONE) {
      if (updateReq.status === 200) {
        const response = JSON.parse(updateReq.responseText);

        alert(
          `Success <strong>${updateReq.status}</strong> ! Updated Product. ID: ${response.id}`,
          "success"
        );

        // Reset form and close modal
        document.getElementById("updateForm").reset();
        $("#update-modal").modal("hide");

        // ---------remove the alert after some time
        var alertElement = document.querySelector(".alert");
        // delay the execution of the function that will hide the alert by 3 seconds
        setTimeout(function () {
          alertElement.remove();
        }, 3000);
      } else {
        console.error(updateReq.statusText);
      }
    }
  };
  updateReq.send(JSON.stringify(payload));
}

// **************DELETE product
function deleteProduct(event) {
  // has saved the id of the product as the id of the trash icon while populating the table data.
  const idx = event.target.id;
  const deleteReq = new XMLHttpRequest();
  deleteReq.open("DELETE", `https://fakestoreapi.com/products/${idx}`);

  deleteReq.onreadystatechange = function () {
    if (deleteReq.readyState === XMLHttpRequest.DONE) {
      if (deleteReq.status === 200) {
        const response = JSON.parse(deleteReq.responseText);

        alert(
          `Success <strong>${deleteReq.status}</strong> ! Deleted Product. ID: ${response.id}`,
          "success"
        );

        // ---------remove the alert after some time
        var alertElement = document.querySelector(".alert");
        // delay the execution of the function that will hide the alert by 3 seconds
        setTimeout(function () {
          alertElement.remove();
        }, 3000);
      } else {
        console.error(deleteReq.statusText);
      }
    }
  };
  deleteReq.send();
}

// IGNORE this section :

// no need of this section for this html page as now products are getting fetched on index.html only. so ignore this small part and read directly the limitProd() function.

// ------------------products_category.html

const catProdDiv = document.querySelector("#cat-products");

if (catProdDiv) {
  console.log("yes getting");
  const catProdReq = new XMLHttpRequest();

  catProdReq.onreadystatechange = function () {
    if (catProdReq.readyState === XMLHttpRequest.DONE) {
      if (catProdReq.status === 200) {
        const productsArray = JSON.parse(catProdReq.responseText);
        console.log("array is >>>>>..", productsArray);

        productsArray.map(function (prod) {
          // if condition because using the same JS file for other html page too which doesnt need this function
          if (productsDiv) {
            // productsDiv.appendChild(createProducts(prod));
          }
        });
      } else {
        alert("Fetching category's products is yet to be configured.", "info");

        // ---------remove the alert after some time
        var alertElement = document.querySelector(".alert");
        // delay the execution of the function that will hide the alert by 3 seconds
        setTimeout(function () {
          alertElement.remove();
        }, 3000);
      }
    }
  };

  // catProdReq.open("GET", localStorage.getItem("cat_link"));
  // catProdReq.send();
}

// CONTINUE :
// ---------------Limit 5 products

function limitProd(n) {
  // removing the div with has all products
  // allProdDiv.remove()
  const allProdDiv1 = document.querySelector("#allProdDiv")
  if (allProdDiv1) {
    allProdDiv1.parentNode.removeChild(allProdDiv1)
  }
  // to remove the div of products which could have been populated by previous limit request
  const limitedProdDiv1 = document.querySelector("#limitedProdDiv")
  if (limitedProdDiv1) {
    limitedProdDiv1.remove()
  }
  // to reset the active button when a button is clicked so that the other can get active at the end
  const element = document.querySelectorAll(`.dropdown-item`)
  element.forEach((ele) => {
    if (ele.classList.contains("active")) {
      ele.classList.remove("active")
    }
  })

  const limitedProdDiv = document.createElement("div");
  limitedProdDiv.setAttribute("id", "limitedProdDiv");
  limitedProdDiv.classList.add("row", "g-4")

  const getLimitedProdReq = new XMLHttpRequest()

  getLimitedProdReq.onreadystatechange = function () {
    if (getLimitedProdReq.readyState === XMLHttpRequest.DONE) {
      if (getLimitedProdReq.status === 200) {
        const productsArray = JSON.parse(getLimitedProdReq.responseText)
        productsArray.map(function (prod) {
          if (limitedProdDiv) {
            limitedProdDiv.appendChild(createProducts(prod))
          }
        })
      }
      else {
        alert("Some error occured.")
      }
    }
  }
  getLimitedProdReq.open("GET", `https://fakestoreapi.com/products?limit=${n}`)
  getLimitedProdReq.send()

  if (limitedProdDiv) {
    productsDiv.appendChild(limitedProdDiv)
  }

  let nclass
  if (n === 5) {
    nclass = "five"
  }
  if (n === 10) {
    nclass = "ten"
  }
  if (n === 15) {
    nclass = "fifteen"
  }
  const ele = document.querySelector(`.${nclass}`)
  ele.classList.add("active");
}

// IGNORE :
// -----------------User 
const allUsersReq = new XMLHttpRequest();

allUsersReq.onreadystatechange = function () {
  if (allUsersReq.readyState === XMLHttpRequest.DONE) {
    if (allUsersReq.status === 200) {
      const usersArray = JSON.parse(allUsersReq.responseText)
      // console.log("response is ", usersArray);
      // usersArray.forEach(item => {
      //   console.log("user is ", item.username);
      //   console.log("pass is ", item.password);
      // })
    }
    else {
      alert("Some error occured.")
    }
  }
}
allUsersReq.open("GET", "https://fakestoreapi.com/users")
allUsersReq.send()

// CONTINUE :

function login() {
  // ---placing dropdown when user is logged in 
  const user = localStorage.getItem("username");
  if (user) {
    const profileDiv = document.querySelector("#profileDiv");
    profileDiv.setAttribute("data-bs-toggle", "dropdown")
    profileDiv.setAttribute("aria-expanded", "false")

    getUserInfo.open("GET", "https://fakestoreapi.com/users")
    getUserInfo.send()
  }
}

const loginForm = document.querySelector(".loginForm")
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  localStorage.setItem("username", username)

  const loginnReq = new XMLHttpRequest();
  loginnReq.open("POST", "https://fakestoreapi.com/auth/login");
  loginnReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  loginnReq.onload = function () {
    if (loginnReq.status === 200) {
      const response = JSON.parse(loginnReq.responseText)
      console.log("Logged in : ", response);

      alert(
        `Success <strong>${loginnReq.status}</strong> ! Logged in . Token: ${response.token.substring(0, 15)}.....${response.token.substring(response.token.length - 5, response.token.length)}`,
        "success"
      );

      const name = localStorage.getItem("username")
      const user = document.querySelector(".username")
      user.innerHTML = name
      // findName()

      // Reset form and close modal
      const loginform = document.querySelector(".loginForm")
      if (loginform) {
        loginform.reset()
      }
      $("#login-modal").modal("hide");

      // ---placing dropdown when user is logged in 
      const username = localStorage.getItem("username");
      if (username) {
        const profileDiv = document.querySelector("#profileDiv");
        profileDiv.setAttribute("data-bs-toggle", "dropdown")
        profileDiv.setAttribute("aria-expanded", "false")

        getUserInfo.open("GET", "https://fakestoreapi.com/users")
        getUserInfo.send()
      }

      // ---------remove the alert after some time
      var alertElement = document.querySelector(".alert");
      // delay the execution of the function that will hide the alert by 3 seconds
      setTimeout(function () {
        alertElement.remove();
      }, 3000);
    }
    else {
      alert(
        `Failure <strong>${loginnReq.status}</strong> ! ${loginnReq.responseText}`,
        "danger"
      )
      // Reset form and close modal
      const loginform = document.querySelector(".loginForm")
      if (loginform) {
        loginform.reset()
      }
      $("#login-modal").modal("hide");

      // ---------remove the alert after some time
      var alertElement = document.querySelector(".alert");
      // delay the execution of the function that will hide the alert by 3 seconds
      setTimeout(function () {
        alertElement.remove();
      }, 3000);
    }
  }
  loginnReq.onerror = function () {
    console.log("Response failed. Status: " + loginnReq.status);
  }
  var data = JSON.stringify({
    username: username,
    password: password
  })
  loginnReq.send(data)
})

function logMeOut() {
  localStorage.removeItem("username")
  // console.log("yess loggin out");
  const userP = document.querySelector(".username")
  userP.innerHTML = `Profile`

  // IGNORE :
  // delete dropdwown
  // const profileDrop = document.querySelector(".user-dropdown");
  // profileDrop.remove()
  // const profileDiv = document.querySelector("#profileDiv");
  // // profileDiv.removeAttribute("data-bs-toggle")
  // profileDiv.removeAttribute("aria-expanded")

  // CONTINUE:
  // no need to delete dropdown we are just reloading the page on logout so a new JS instance is created 
  location.reload()

}


// IGNORE:
//  no need of this now as logout div has been shifted to the dropdown xxxxxxxxxxxxxxxxxxxxx

// ----Logout div needs to be deleted when the user is not logged in(means when the localstorage doesnt have a "username" variable)

// This event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
// document.addEventListener("DOMContentLoaded", function () {
//   // to wait for external resources like stylesheets, images to load :
//   window.onload = function () {
//     // console.log("Attemmpting");
//     const logoutDiv = document.querySelector("#logout")
//     const userPresent = localStorage.getItem("username")
//     // console.log("logOutDiv is ", logoutDiv);
//     // console.log("user is ", userPresent);
//     if (userPresent === null && logoutDiv) {
//       console.log("hello from if");
//       logoutDiv.style.setProperty("display", "none", "important")
//     }
//   }
// })

// CONTINUE :

// -----------------footer

const footer = document.getElementById("footer")

const footer_row = document.createElement("div")
footer_row.classList.add("row", "mt-5", "mx-auto")
footer_row.innerHTML = `
<div class="col-lg-3">
<strong><p>ONLINE SHOPPING</p></strong>
<p>Electronics</p>
<p>Jewelery</p>
<p>Men's clothing</p>
<p>Women's clothing</p>
</div>
<div class="col-lg-3 original">
<strong>100% ORIGINAL</strong>
<span>
  guarantee for all products at myntra.com
</span> 
</div>
<div class="col-lg-3">
<strong><p>Tech Stack</p></strong>
<p>Javascript DOM</p>
<p>HTML</p>
<p>CSS</p>
<p>Bootstrap</p>
</div>
<div class="col-lg-3 routes">
<strong><p>ROUTES</p></strong>
<ul class="p-0">
  <li><input checked="" disabled="" type="checkbox"><span class="text-primary ">GET</span> /products</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-primary ">GET</span> /products/1</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-primary ">GET</span> /products/categories</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-primary ">GET</span> /products?limit=5</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-primary ">GET</span> /users</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-success">POST</span> /products</li>

  <li><input checked="" disabled="" type="checkbox"><span class="text-success">POST</span> /auth/login</li>
  
  <li><input checked="" disabled="" type="checkbox"><span class="text-warning">PUT</span> /products/1</li>
  
  <li><input checked="" disabled="" type="checkbox"><span class="text-danger">DELETE</span> /products/1</li>
</ul>
</div>

`
footer.appendChild(footer_row);

const bottom_footer = document.createElement("div")
bottom_footer.classList.add("p-4", "footer-bottom")
bottom_footer.innerHTML = `
<div class="container text-center">
<p class="m-0">© 2023 www.mytra.com. All rights reserved.</p>
</div>
`

footer.appendChild(bottom_footer)