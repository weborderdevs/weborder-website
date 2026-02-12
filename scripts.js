feather.replace();

// ============================================================================
// DOM Elements Cache
// ============================================================================

const DOM = {
  hero: document.getElementById('hero'),
  overlays: document.getElementsByClassName('overlay'),
  menus: document.getElementsByClassName('menu'),
  headerLogo: document.querySelector('.header-logo img'),
  hamburgerBtn: document.querySelector('.hamburger-btn'),
  nav: document.querySelector('nav'),
  meetupsThumbnails: document.querySelector('.meetups-thumbnails'),
  imageModal: document.querySelector('.image-modal'),
  modalImage: document.querySelector('.image-modal img'),
  closeModalBtn: document.querySelector('.close-modal')
};

// ============================================================================
// Configuration Constants
// ============================================================================

const CONFIG = {
  IMG_PATH: 'img/meetups/',
  THUMBNAIL_SUFFIX: '/thumbnails/',
  
  // Provisional meetup images - will be replaced with Instagram API integration
  MEETUP_IMAGES: [
    { src: 'meetup-1-1.jpg', alt: 'Meetup 1' },
    { src: 'meetup-1-2.jpg', alt: 'Meetup 1 segunda imagen' },
    { src: 'meetup-2-1.jpg', alt: 'Meetup 2' },
    { src: 'meetup-2-2.jpg', alt: 'Meetup 2 segunda imagen' },
    { src: 'meetup-virtual-1.jpg', alt: 'Meetup virtual' },
    { src: 'meetup-virtual-2.jpg', alt: 'Meetup virtual 2' }
  ]
};

// ============================================================================
// State Management
// ============================================================================

const state = {
  isMenuOpen: false,
  currentOverlay: null
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Toggle CSS class on a single element
 * @param {Element} element - DOM element
 * @param {string} className - CSS class to toggle
 * @param {boolean} force - Force add (true) or remove (false)
 */
function toggleClass(element, className, force) {
  if (!element) return;
  
  if (force === true) {
    element.classList.add(className);
  } else if (force === false) {
    element.classList.remove(className);
  } else {
    element.classList.toggle(className);
  }
}

/**
 * Remove class from all elements in a collection
 * @param {HTMLCollection} elements - Collection of DOM elements
 * @param {string} className - CSS class to remove
 */
function removeClassFromAll(elements, className) {
  if (!elements || elements.length === 0) return;
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove(className);
  }
}

/**
 * Check if any overlay is currently active
 * @returns {boolean} True if any overlay is active
 */
function isAnyOverlayActive() {
  for (let i = 0; i < DOM.overlays.length; i++) {
    if (DOM.overlays[i].classList.contains('active')) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// Hero Section Functions
// ============================================================================

function hideHero() {
  toggleClass(DOM.hero, 'active', false);
}

function showHero() {
  toggleClass(DOM.hero, 'active', true);
}

// ============================================================================
// Navigation Functions
// ============================================================================

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  toggleClass(DOM.nav, 'active', state.isMenuOpen);
  
  // Update hamburger button aria label
  if (DOM.hamburgerBtn) {
    toggleClass(DOM.hamburgerBtn, 'active', state.isMenuOpen);
    const label = state.isMenuOpen ? 'Cerrar menú' : 'Abrir menú';
    DOM.hamburgerBtn.setAttribute('aria-label', label);
  }
}

/**
 * Close mobile navigation menu
 */
function closeMenu() {
  state.isMenuOpen = false;
  toggleClass(DOM.nav, 'active', false);
  
  if (DOM.hamburgerBtn) {
    toggleClass(DOM.hamburgerBtn, 'active', false);
    DOM.hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
  }
}

/**
 * Clean active state from all menu items
 */
function cleanMenu() {
  removeClassFromAll(DOM.menus, 'active');
}

// ============================================================================
// Overlay Management
// ============================================================================

/**
 * Show specified overlay view
 * @param {string} overlayView - ID of the overlay to show
 */
function showOverlay(overlayView) {
  // Close mobile menu if open
  if (state.isMenuOpen) {
    closeMenu();
  }
  
  hideHero();
  hideOverlay(false);
  cleanMenu();
  
  const overlay = document.getElementById(overlayView);
  if (!overlay) {
    console.error(`Overlay with ID "${overlayView}" not found`);
    return;
  }
  
  // Update state
  state.currentOverlay = overlayView;
  
  // Show overlay and activate related elements
  toggleClass(overlay, 'active', true);
  
  const navLink = document.querySelector(`.menu.${overlayView}`);
  if (navLink) {
    toggleClass(navLink, 'active', true);
  }
  
  if (DOM.headerLogo) {
    toggleClass(DOM.headerLogo, 'active', true);
  }
  
  // Special handling for meetups view
  if (overlayView === 'meetups-view') {
    generateMeetupThumbnails();
  }
}

/**
 * Hide all overlays
 * @param {boolean} shouldShowHero - Whether to show hero after hiding overlay
 */
function hideOverlay(shouldShowHero = false) {
  removeClassFromAll(DOM.overlays, 'active');
  cleanMenu();
  state.currentOverlay = null;
  
  if (shouldShowHero) {
    showHero();
    if (DOM.headerLogo) {
      toggleClass(DOM.headerLogo, 'active', false);
    }
  }
}

// ============================================================================
// Meetup Gallery Functions
// ============================================================================

/**
 * Generate meetup thumbnails from provisional data
 * Note: In production, this will fetch from Instagram API
 */
function generateMeetupThumbnails() {
  if (!DOM.meetupsThumbnails) {
    console.error('Meetups thumbnails container not found');
    return;
  }
  
  console.log('Generating meetup thumbnails...');
  
  // Clear container
  DOM.meetupsThumbnails.innerHTML = '';
  
  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  CONFIG.MEETUP_IMAGES.forEach(image => {
    const imgElement = createThumbnailElement(image);
    fragment.appendChild(imgElement);
  });
  
  DOM.meetupsThumbnails.appendChild(fragment);
}

/**
 * Create thumbnail element for meetup image
 * @param {Object} image - Image object with src and alt properties
 * @returns {HTMLImageElement} Thumbnail image element
 */
function createThumbnailElement(image) {
  const imgElement = document.createElement('img');
  
  // Set attributes
  imgElement.src = `${CONFIG.IMG_PATH}${CONFIG.THUMBNAIL_SUFFIX}${image.src}`;
  imgElement.alt = image.alt;
  imgElement.classList.add('thumbnail');
  
  // Add click handler
  imgElement.addEventListener('click', () => openImageModal(image));
  
  return imgElement;
}

/**
 * Fetch meetup images from Instagram API (production-ready placeholder)
 * @returns {Promise<Array>} Promise resolving to array of image objects
 */
async function fetchMeetupImagesFromInstagram() {
  // This is a placeholder for production Instagram API integration
  console.log('Fetching meetup images from Instagram API...');
  
  // Example API call structure:
  // try {
  //   const response = await fetch('https://api.instagram.com/v1/users/self/media/recent', {
  //     headers: { 'Authorization': `Bearer ${INSTAGRAM_ACCESS_TOKEN}` }
  //   });
  //   const data = await response.json();
  //   return data.data.map(item => ({
  //     src: item.images.standard_resolution.url,
  //     alt: item.caption?.text || 'Meetup image',
  //     thumbnail: item.images.low_resolution.url
  //   }));
  // } catch (error) {
  //   console.error('Error fetching Instagram images:', error);
  //   return CONFIG.MEETUP_IMAGES; // Fallback to provisional images
  // }
  
  // For now, return provisional images
  return Promise.resolve(CONFIG.MEETUP_IMAGES);
}

// ============================================================================
// Image Modal Functions
// ============================================================================

/**
 * Open image modal with specified image
 * @param {Object} image - Image object with src and alt properties
 */
function openImageModal(image) {
  if (!DOM.imageModal || !DOM.modalImage) {
    console.error('Image modal elements not found');
    return;
  }
  
  DOM.modalImage.src = `${CONFIG.IMG_PATH}${image.src}`;
  DOM.modalImage.alt = image.alt;
  toggleClass(DOM.imageModal, 'active', true);
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  // Add a class to the body so we can take other actions
  document.body.classList.add('image-open');
}

/**
 * Close image modal
 */
function closeImageModal() {
  if (!DOM.imageModal) return;
  
  toggleClass(DOM.imageModal, 'active', false);
  
  // Restore body scroll
  document.body.style.overflow = '';
  // Remove the image modal class from the body
  document.body.classList.remove('image-open');
}

// ============================================================================
// Event Listeners Setup
// ============================================================================

/**
 * Handle Escape key press
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscapeKey(e) {
  if (e.key !== 'Escape') return;
  
  // Close image modal if open
  if (DOM.imageModal?.classList.contains('active')) {
    closeImageModal();
    return;
  }
  
  // Close any open overlay
  if (isAnyOverlayActive()) {
    hideOverlay(true);
    return;
  }
  
  // Close mobile menu if open
  if (state.isMenuOpen) {
    closeMenu();
  }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // Close modal when clicking outside the image
  if (DOM.imageModal) {
    DOM.imageModal.addEventListener('click', (e) => {
      if (e.target === DOM.imageModal) {
        closeImageModal();
      }
    });
  }
  
  // Handle Escape key for closing modals, overlays, and menu
  document.addEventListener('keydown', handleEscapeKey);
  
  // Close mobile menu when clicking on a menu item
  if (DOM.nav) {
    DOM.nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && state.isMenuOpen) {
        closeMenu();
      }
    });
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the application
 */
function init() {
  console.log('Weborder Developers - Initializing...');
  
  // Initialize event listeners
  initEventListeners();
  
  // Production-ready: Uncomment to fetch from Instagram API
  // fetchMeetupImagesFromInstagram().then(images => {
  //   CONFIG.MEETUP_IMAGES = images;
  // });
}

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================================
// Public API (for HTML onclick handlers)
// ============================================================================

// Expose functions to global scope for HTML onclick handlers
window.hideHero = hideHero;
window.showHero = showHero;
window.showOverlay = showOverlay;
window.hideOverlay = hideOverlay;
window.cleanMenu = cleanMenu;
window.generateMeetupThumbnails = generateMeetupThumbnails;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.toggleMenu = toggleMenu;
