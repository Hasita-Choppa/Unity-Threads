if (document.readyState == "loading")
{
    document.addEventListener("DOMContentLoaded", ready);
}
else
{
    ready()
}

function ready() 
{
    // Remove Item from Cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++)
    {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem)
    }

    //Quantity Change
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++)
    {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged)
    }

    // Add to cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++)
    {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked)
    }
}

// Add event listeners to all "Add to Cart" buttons
var addCartButtons = document.getElementsByClassName("add-cart");
for (var i = 0; i < addCartButtons.length; i++) 
{
    var button = addCartButtons[i];
    button.addEventListener("click", addCartClicked);
}

document.getElementById("close-cart").addEventListener("click", function () {
    var cart = document.querySelector(".cart");
    cart.classList.remove("show"); // Hide the cart by removing the "show" class
});

// Remove Cart Item
function removeCartItem(event)
{
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function quantityChanged(event)
{
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0)
    {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

//Add Cart Function

document.getElementById("cart-icon").addEventListener("click", function () {
    var cart = document.querySelector(".cart");
    cart.classList.toggle("show"); // Toggle the cart's visibility by adding/removing the "show" class
});




function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.closest('.product-box');
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();

    var cart = document.querySelector(".cart");
    cart.classList.add("show");

    var closeCartButton = document.getElementById("close-cart");
    closeCartButton.addEventListener("click", function() {
        var cart = document.querySelector(".cart");
        cart.classList.remove("show"); // Hide the cart by removing the "show" class
    });
}

function addProductToCart(title, price, productImg, quantity = 1)
{
    var cartContent = document.getElementsByClassName("cart-content")[0];
        
    // Check if item is already in the cart
    var cartItems = cartContent.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].innerText === title) {
            alert("You have already added this item to your cart.");
            return;
        }
    }

    // Create a new cart item
    var cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    var cartBoxContent = `
        <img src="${productImg}" class="cart-img" alt="${title}">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <img class="cart-remove" src="trash.png" style="width: 30%">`;
    cartBox.innerHTML = cartBoxContent;
    cartContent.append(cartBox);

    // Add event listeners for the new elements
    cartBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    updateCartIcon();
    saveCartItems();
    updateTotal()
}

// Update Total
function updateTotal()
{
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++)
    {
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace(/[^0-9.]/g, ""));
        var quantity = quantityElement.value;
        
        if(!isNaN(price) && !isNaN(quantity))
        {
            total += price * quantity;
        }
    }
    document.getElementsByClassName("total-price")[0].innerText = "$" + total.toFixed(2);
    localStorage.setItem("cartTotal", total);
}

// Keep Item in cart when page refresh with LocalStorage
function saveCartItems()
{
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i++)
    {
        cartBox = cartBoxes[i]
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = 
        {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        }
        cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadCartItems() {
    var savedItems = localStorage.getItem("cartItems");
    if (savedItems) {
        var cartItems = JSON.parse(savedItems);
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            console.log("Loading item:", item);
            addProductToCart(item.title, item.price, item.productImg, item.quantity);
        }
    } else {
        console.log('No items found in cart.');
    }
    updateCartIcon();
}

function updateCartIcon()
{
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i++)
    {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }

    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", quantity);
    console.log('Cart quantity:', quantity); // Debugging line
}

document.addEventListener("DOMContentLoaded", function () 
{
    let cartIcon = document.querySelector("#cart-icon");
    let cart = document.querySelector(".cart");
    let closeCart = document.querySelector("#close-cart");

    //Open Cart
    cartIcon.onclick = () => {
        cart.classList.add("active");
    }

    //Close Cart
    closeCart.onclick = () => {
        cart.classList.remove("active");
    }
    loadCartItems()
    updateTotal()

});
