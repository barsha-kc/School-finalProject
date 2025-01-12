let currentPage = 1;
const itemsPerPage = 10;

let menuData = []; // Store fetched data globally for sorting

let pageType = "other";
if (document.querySelector(".menu-container")) {
  pageType = "menu";
} else if (document.querySelector(".cart-container")) {
  pageType = "cart";
}

// Fetch data and render menu
// async function fetchData() {
//   const response = await fetch(
//     "https://6762d1f417ec5852cae7350f.mockapi.io/food"
//   );
//   menuData = await response.json();

//   if (pageType === "menu") {
//     renderMenu(menuData);
//   }
// }

//new api : https://trattoria-sicily.gonnaorder.com/?ulang=en
async function fetchData() {
  const res = await fetch("https://trattoria-sicily.gonnaorder.com/api/v1/stores/1010/catalog?languageId=en&referenceTime=2025-01-07T00:30:00Z");
  const { categories: response } = await res.json();
  response.forEach((category) => {
    menuData.push(...category.offers);
  });

  if (pageType === "menu") {
    renderMenu(menuData);
  }
}
console.log(menuData)



function renderMenu(data) {
  const menuContainer = document.querySelector(".menu-container");
  menuContainer.innerHTML = "";

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Render items for the current page
  paginatedData.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    const image = item?.standardImage ?? "Images/fsr-placeholder.webp";

    menuItem.innerHTML = `
      <h2>${item.name}</h2>
      <img src="${image}" alt="${item.name}">
      <span>${item.formattedPrice}</span>
      <button class="add-to-cart" onclick="addToCart(${item.offerId})">Add to cart</button>
    `;
    menuContainer.appendChild(menuItem);
  });

  // Render pagination controls
  renderPaginationControls(data.length);
}



function renderPaginationControls(totalItems) {
  const paginationContainer = document.querySelector(".pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log("Total Pages:", totalPages)

  if (totalPages <= 1) return;


  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i; // Set current page
      renderMenu(menuData); // Re-render menu with new page
    });
    paginationContainer.appendChild(button);
  }
}


// Render cart items
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const image = item?.standardImage ?? "Images/fsr-placeholder.webp";

    cartItem.innerHTML = `
      <h2 class="menu-item-header">${item.name}</h2>
      <img class="menu-item-image" src="${image}" alt="${item.name}">
      <span>${item.formattedPrice}</span>
      <span>Quantity: ${item.count}</span>
      <button class="remove-from-cart" onclick="removeFromCart(${item.offerId})">Remove</button>
    `;
    cartContainer.appendChild(cartItem);
  });
}

// Add item to cart
function addToCart(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemDetails = menuData.find(
    (item) => Number.parseInt(item.offerId) === itemId
  );

  const existingItem = cart.find((item) => Number.parseInt(item.offerId) === itemId);

  if (existingItem) {
    existingItem.count++;
  } else {
    cart.push({ ...itemDetails, count: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

// Remove item from cart
function removeFromCart(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const newCart = cart.filter((item) => Number.parseInt(item.offerId) !== itemId);

  localStorage.setItem("cart", JSON.stringify(newCart));
  renderCart();
  updateCartCounter();
}

// Update cart counter
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".cart-count");
  cartCount.textContent = cart.length;
  cartCount.style.display = cart.length ? "block" : "none";
}

// Sort menu items
function sortMenu(option) {
  let sortedData = [...menuData];
  switch (option) {
    case "initials-asc":
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "initials-desc":
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      sortedData.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedData.sort((a, b) => b.price - a.price);
      break;
  }
  renderMenu(sortedData);
}

// Setup event listeners
function setupEventListeners() {
  document.querySelector("#sort-options").addEventListener("change", (e) => sortMenu(e.target.value));
  document.querySelector("#search-button").addEventListener("click", handleSearch);
}

function handleSearch() {
  const searchInput = document.querySelector("#search-input").value.toLowerCase();
  const filteredData = menuData.filter((item) => item.name.toLowerCase().includes(searchInput));
  renderMenu(filteredData);
}

// Initialize the page
fetchData();
updateCartCounter();

if (pageType === "menu") {
  setupEventListeners();
}

if (pageType === "cart") {
  renderCart();
}