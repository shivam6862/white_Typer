const backdrop = document.querySelector(".backdrop");
const menuToggle = document.querySelector(".hamburger");
const menuToggle1 = document.querySelector(".hamburger1");
const sideDrawer = document.querySelector(".main-header__nav");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.style.display = "none";
  menuToggle1.style.display = "none";
  menuToggle.style.display = "block";
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.style.display = "block";
  menuToggle1.style.display = "block";
  menuToggle.style.display = "none";
}

function menuToggleClickHandler1() {
  backdrop.style.display = "none";
  sideDrawer.style.display = "none";
  menuToggle1.style.display = "none";
  menuToggle.style.display = "block";
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
menuToggle1.addEventListener("click", menuToggleClickHandler1);

window.addEventListener("resize", function (event) {
  if (this.document.body.clientWidth > 500) {
    backdrop.style.display = "none";
    sideDrawer.style.display = "flex";
    menuToggle1.style.display = "none";
    menuToggle.style.display = "none";
  } else {
    backdrop.style.display = "none";
    sideDrawer.style.display = "none";
    menuToggle1.style.display = "none";
    menuToggle.style.display = "block";
  }
});
