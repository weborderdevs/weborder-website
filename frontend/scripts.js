feather.replace(); // Icons

function hideHero() {
    const hero = document.getElementById('hero');
    hero.classList.remove('active');
}

function showHero() {
    const hero = document.getElementById('hero');
    hero.classList.add('active');
}

function showOverlay(overlayView) {
    hideHero();
    hideOverlay();
    cleanMenu();
    const overlay = document.getElementById(overlayView);
    overlay.classList.add('active');
    const navLink = document.querySelector('.menu.' + overlayView);
    navLink.classList.add('active');
    const logo = document.querySelector('.header-logo img');
    logo.classList.add('active');
}

function hideOverlay(shouldShowHero) {
    const overlay = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlay.length; i++) {
        overlay[i].classList.remove('active');
    }
    cleanMenu();

    if (shouldShowHero) {
        showHero();
        const logo = document.querySelector('.header-logo img');
        logo.classList.remove('active');
    }
}

function cleanMenu() {
    const menu = document.getElementsByClassName('menu');
    for (let i                                                                                                                                                                                                                              = 0; i < menu.length; i++) {
        menu[i].classList.remove('active');
    }
}

function getInstagramFeed() {
    
}