const prices = {
  "Chocolate Chip Cookie": 5,
  "Peanut Butter Cookie": 4,
  "Oatmeal Raisin Cookie": 6,
  "Strawberry Cookies": 8,
  "Red Velvet Cake": 25,
};

function updateCartCount(cart) {
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = cart.length;
  }
}

// Code for index.html (Main Shop Page)
function indexPageScripts() {
  let cart = [];

  // Load cart from localStorage if available
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount(cart);
  }

  window.addToCart = function(productName) {
    cart.push(productName);
    updateCartCount(cart);
    alert(productName + " has been added to your cart!");
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  window.showCart = function() {
    const cartSection = document.getElementById("cart-section");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");
    const totalItemsElem = document.getElementById("total-items");

    cartSection.style.display = "block";
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<li>Your cart is empty.</li>";
      totalItemsElem.textContent = "Total Items: 0";
      totalPriceElem.textContent = "Total Price: $0";
    } else {
      const itemCount = {};
      cart.forEach((item) => {
        itemCount[item] = (itemCount[item] || 0) + 1;
      });

      for (const item in itemCount) {
        const li = document.createElement("li");
        const price = prices[item] * itemCount[item];
        li.textContent = `${item} x ${itemCount[item]} = $${price}`;
        cartItems.appendChild(li);
      }

      const totalItems = cart.length;
      const totalPrice = cart.reduce((acc, item) => acc + prices[item], 0);

      totalItemsElem.textContent = "Total Items: " + totalItems;
      totalPriceElem.textContent = "Total Price: $" + totalPrice;
    }
    cartSection.scrollIntoView({ behavior: "smooth" });
  };

  window.clearCart = function() {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = [];
      updateCartCount(cart);
      showCart();
      localStorage.removeItem("cartItems");
    }
  };

  window.proceedToCheckout = function() {
    if (cart.length === 0) {
      alert("Your cart is empty. Add some cookies first!");
      return;
    }
    localStorage.setItem("cartItems", JSON.stringify(cart));
    window.location.href = "checkout.html";
  };
}

// Code for checkout.html (Checkout Page)
function checkoutPageScripts() {
  const orderItemsList = document.getElementById("order-items");
  const orderTotalElem = document.getElementById("order-total");

  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cart.length === 0) {
    orderItemsList.innerHTML = "<li>Your cart is empty.</li>";
    orderTotalElem.textContent = "";
  } else {
    const itemCount = {};
    cart.forEach((item) => {
      itemCount[item] = (itemCount[item] || 0) + 1;
    });

    let totalPrice = 0;

    for (const item in itemCount) {
      const price = prices[item] * itemCount[item];
      totalPrice += price;
      const li = document.createElement("li");
      li.textContent = `${item} x ${itemCount[item]} = $${price}`;
      orderItemsList.appendChild(li);
    }
    orderTotalElem.textContent = "Total Price: $" + totalPrice;
  }

  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for your order, " + this.name.value + "! We will contact you shortly.");
      localStorage.removeItem("cartItems");
      window.location.href = "index.html";
    });
  }
}

// Detect which page and run respective scripts
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-section")) {
    // This means we're on the main page with cart section
    indexPageScripts();
  }
  if (document.getElementById("order-items")) {
    // This means we're on the checkout page
    checkoutPageScripts();
  }
});