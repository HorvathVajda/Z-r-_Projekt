var currentUrl = window.location.href;

var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach(function(link) {
    link.classList.remove('active');

    if (link.href === currentUrl) {
        link.classList.add('active');
    }
});