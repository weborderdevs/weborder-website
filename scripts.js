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
    for (let i = 0; i < menu.length; i++) {
        menu[i].classList.remove('active');
    }
}

const IMG_PATH = 'img/meetups/';

const MEETUP_IMAGES = [
    {
        src: 'meetup-1-1.jpg',
        alt: 'Meetup 1',
    },
    {
        src: 'meetup-1-2.jpg',
        alt: 'Meetup 1 segunda imagen',
    },
    {
        src: 'meetup-2-1.jpg',
        alt: 'Meetup 2',
    },
    {
        src: 'meetup-2-2.jpg',
        alt: 'Meetup 2 segunda imagen',
    },
    {
        src: 'meetup-virtual-1.jpg',
        alt: 'Meetup virtual',
    },
    {
        src: 'meetup-virtual-2.jpg',
        alt: 'Meetup virtual 2',
    },
];

function generateMeetupThumbnails() {
    const thumbnailsContainer = document.querySelector('.meetups-thumbnails');
    thumbnailsContainer.innerHTML = '';

    [...MEETUP_IMAGES].forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.onclick = () => openImageModal(image);
        imgElement.src = `${IMG_PATH}/thumbnails/${image.src}`;
        imgElement.alt = image.alt;
        imgElement.classList.add('thumbnail');
        thumbnailsContainer.appendChild(imgElement);
    });
}

function openImageModal(imageOnModal) {
    const modalElement = document.querySelector('.image-modal');
    const modalImgElement = document.querySelector('.image-modal img');
    modalImgElement.src = `${IMG_PATH}${imageOnModal.src}`;
    modalImgElement.alt = imageOnModal.alt;
    modalElement.classList.add('active');
}

function closeImageModal() {
    const modalElement = document.querySelector('.image-modal');
    modalElement.classList.remove('active');
}

function preventDefault(event) {
    event.preventDefault();
}
