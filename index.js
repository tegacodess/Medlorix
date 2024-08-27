// Menu bar functionlity
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navigation = document.querySelector(".navigation");
    const headerLogo = document.querySelector(".brand-logo");
    const navLinks = document.querySelectorAll(".navigation a");
  
    hamburgerMenu?.addEventListener("click", function () {
      navigation.classList.toggle("show");
      headerLogo.classList.toggle("hide");
    });
  
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navigation.classList.remove("show");
        headerLogo.classList.remove("hide");
      });
    });
  });

  // When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// Functionality for back to top button
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}