function navbar() {
  document.write(`<div class="navbar">
  <div class="navbar">
  <a href="./index.html${location.search}">Home</a>
  <a href="./products_display.html${location.search}">Sneaker</a>
  <a href="./Bearbrick.html${location.search}">Bearbrick</a>
  <a href="./Streetwear.html${location.search}">Streetwear</a>
  <div class="subnav">
    <button class="subnavbtn">My Account <i class="fa fa-caret-down"></i></button>
    <div class="subnav-content">
    <a class="active" href="./login.html${location.search}">Login</a>
    <a href="./register.html${location.search}">Register</a>
    <a href="./cart.html${location.search}">Shopping Cart</a>
    <a href="./process_logout">Logout</a>
</div>

       `);
}