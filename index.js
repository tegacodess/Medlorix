document.addEventListener('DOMContentLoaded', function() {
  
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });
  
  
  // Services Dropdown Menu Functionality
  const dropbtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  const dropdownMainIcon = document.querySelector('.dropdown-down');

  dropbtn.addEventListener('click', function(event) {
    event.preventDefault();
    dropdownContent.classList.toggle('show');
    dropdownMainIcon.classList.toggle('rotate');
  });

  // Close the dropdown if the user clicks outside of it
  window.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
      if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
        dropdownMainIcon.classList.remove('rotate')
      }
    }
  });

  
// Hamburger Menu functionlity
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navigation = document.querySelector(".navigation");
  const headerLogo = document.querySelector(".brand-logo");
  const navigationLinks = document.querySelectorAll(".navigation a");
  
  hamburgerMenu?.addEventListener("click", function () {
    navigation.classList.toggle("show");
    headerLogo.classList.toggle("hide");
  });
  
  navigationLinks.forEach((link) => {
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