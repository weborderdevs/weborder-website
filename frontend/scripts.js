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
  closeModalBtn: document.querySelector('.close-modal'),
};

// ============================================================================
// Configuration Constants
// ============================================================================
const BACKUP_MEDIA = [
  {
    src: 'meetup-1-1.jpg',
    caption: 'Meetup 1',
    thumbnail: 'meetup-1-1.jpg',
  },
  {
    src: 'meetup-1-2.jpg',
    caption: 'Meetup 1 segunda imagen',
    thumbnail: 'meetup-1-2.jpg',
  },
  {
    src: 'meetup-2-1.jpg',
    caption: 'Meetup 2',
    thumbnail: 'meetup-2-1.jpg',
  },
  {
    src: 'meetup-2-2.jpg',
    caption: 'Meetup 2 segunda imagen',
    thumbnail: 'meetup-2-2.jpg',
  },
  {
    src: 'meetup-virtual-1.jpg',
    caption: 'Meetup virtual',
    thumbnail: 'meetup-virtual-1.jpg',
  },
  {
    src: 'meetup-virtual-2.jpg',
    caption: 'Meetup virtual 2',
    thumbnail: 'meetup-virtual-2.jpg',
  },
];
const CONFIG = {
  IMG_PATH: 'img/meetups/',
  THUMBNAIL_SUFFIX: '/thumbnails/',

  // Provisional meetup images - will be replaced with Instagram API integration
  MEETUP_IMAGES: [...BACKUP_MEDIA],
};

// ============================================================================
// State Management
// ============================================================================

const state = {
  isMenuOpen: false,
  currentOverlay: null,
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

  CONFIG.MEETUP_IMAGES.forEach((image) => {
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

  const isInstagramURL = image.src.startsWith('http');
  // Set attributes
  imgElement.src = isInstagramURL
    ? image.thumbnail
    : `${CONFIG.IMG_PATH}${CONFIG.THUMBNAIL_SUFFIX}${image.thumbnail}`;
  imgElement.alt = image.caption || 'Meetup image';
  imgElement.classList.add('thumbnail');

  // Add click handler
  imgElement.addEventListener('click', () => openImageModal(image));

  return imgElement;
}

/**
 * Process Instagram media items by type
 * @param {Array} instagramMedia - Array of media items from Instagram API
 * @returns {Array} Processed media objects with normalized structure
 */

function processInstagramMedia(instagramMedia) {
  const processedMedia = [];

  instagramMedia
    .filter(
      // TODO: Handle videos in the future, meanwhile we only want images and carousels
      (item) =>
        item.media_type === 'IMAGE' ||
        item.media_type === 'CAROUSEL_ALBUM',
    )
    .forEach((item) => {
      const {
        media_type,
        caption = 'Meetup image',
        media_url,
        thumbnail_url,
        children = [],
      } = item;

      if (media_type === 'CAROUSEL_ALBUM') {
        // Handle carousel - process each child media
        children.data.forEach((child, index) => {
          const childUrl = child.media_url;
          processedMedia.push({
            src: childUrl,
            caption: `${caption} (${index + 1}/${children.length})`,
            thumbnail: childUrl,
            type: media_type,
          });
        });
      } else {
        processedMedia.push({
          src: media_url,
          caption: caption,
          thumbnail: thumbnail_url || media_url,
          type: media_type,
        });
      }
    });

  return processedMedia;
}

/**
 * Fetch meetup images from Instagram API (production-ready)
 * @returns {Promise<Array>} Promise resolving to array of processed image objects
 */
async function fetchMeetupImagesFromInstagram() {
  const APP_URL = 'http://localhost:3000';
  try {
    const response = await fetch(`${APP_URL}/instagram`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      const processedMedia = processInstagramMedia(data.data);
      return processedMedia;
    } else {
      console.warn('Invalid response format from Instagram API');
      return BACKUP_MEDIA;
    }
  } catch (error) {
    console.error('Error fetching Instagram images:', error);
    return BACKUP_MEDIA; // Fallback to provisional images
  }
}

// ============================================================================
// Terminal Output
// ============================================================================

const TERMINAL_MESSAGES = [
  { cmd: 'weborder --stats', output: '100+ miembros\n6 meetups\n2 tutoriales' },
  { cmd: 'weborder --members', output: 'Desarrolladores\nEntusiastas de tecnología' },
  { cmd: 'cat /etc/kernel-team', output: 'Victor Talamantes\nEfren Gonzalez\nRaul Ruiz' },
  { cmd: 'ping borderplex', output: '42ms — comunidad activa\nJuarez, El Paso & Las Cruces\n0% packet loss' },
  { cmd: 'crontab -l', output: 'Viernes 19:00 MST\nPodcast en vivo' },
  { cmd: 'ls comunidad/', output: 'podcast/  meetups/\ntutoriales/  conocimiento/' },
  { cmd: 'neofetch', output: 'OS: WeBorder Developers\nHost: borderplex\nKernel: 6.8-comunidad' },
];

const termState = {
  index: 0,
  running: true,
};

function typeChar(el, text, i, speed, done) {
  if (i < text.length) {
    el.textContent += text[i];
    setTimeout(() => typeChar(el, text, i + 1, speed, done), speed);
  } else if (done) {
    done();
  }
}

function startTerminal() {
  const output = document.querySelector('.terminal-output');
  if (!output) return;

  function cycle() {
    if (!termState.running) return;

    output.innerHTML = '';
    const msg = TERMINAL_MESSAGES[termState.index % TERMINAL_MESSAGES.length];
    termState.index++;

    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = '<span class="terminal-prompt">❯ </span>';
    output.appendChild(cmdLine);

    typeChar(cmdLine, msg.cmd, 0, 40, () => {
      const outLine = document.createElement('div');
      outLine.style.color = 'var(--text-secondary)';
      output.appendChild(outLine);

      typeChar(outLine, msg.output, 0, 20, () => {
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '_';
        output.appendChild(cursor);
        setTimeout(() => {
          if (termState.running) {
            setTimeout(cycle, 1000);
          }
        }, 3000);
      });
    });
  }

  setTimeout(cycle, 800);
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

  const isInstagramURL = image.src.startsWith('http');

  DOM.modalImage.src = isInstagramURL
    ? image.src
    : `${CONFIG.IMG_PATH}${image.src}`;
  DOM.modalImage.alt = image.caption || 'Meetup image';
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

// ============================================================================
// Event Listeners Setup
// ============================================================================

/**
 * Handle key press
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeys(e) {
  // Handle Escape key
  if (e.key === 'Escape') {
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
    return;
  }

  // Handle p key for podcast view
  if (e.key === 'p' || e.key === 'P') {
    showOverlay('podcast-view');
    return;
  }

  // Handle m key for meetups view
  if (e.key === 'm' || e.key === 'M') {
    showOverlay('meetups-view');
    return;
  }

  // Handle a key for about view
  if (e.key === 'a' || e.key === 'A') {
    showOverlay('about-view');
    return;
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
  document.addEventListener('keydown', handleKeys);

  // Close mobile menu when clicking on a menu item
  if (DOM.nav) {
    DOM.nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && state.isMenuOpen) {
        closeMenu();
      }
    });
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
  document.addEventListener('keydown', handleKeys);

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

  // Start terminal output
  startTerminal();

  // Fetch and process Instagram media
  fetchMeetupImagesFromInstagram()
    .then((media) => {
      CONFIG.MEETUP_IMAGES = media;

      // Generate thumbnails after media is loaded
      generateMeetupThumbnails();
    })
    .catch((error) => {
      console.error('Failed to initialize Instagram media:', error);
      CONFIG.MEETUP_IMAGES = BACKUP_MEDIA;
      generateMeetupThumbnails();
    });
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
