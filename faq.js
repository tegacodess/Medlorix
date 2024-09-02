document.addEventListener('DOMContentLoaded', () => {
    const details = document.querySelectorAll('details');

    details.forEach((targetDetail) => {
        targetDetail.addEventListener('click', () => {
            details.forEach((detail) => {
                if (detail !== targetDetail) {
                    detail.removeAttribute('open');
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
});