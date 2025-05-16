/**
 * @fileoverview Navigation component for Jimmy Halvardsson Mountain Guide website
 * Uses BEM methodology for class naming
 * @version 1.0.0
 */

/**
 * Initialize all navigation functionality
 * @param {HTMLElement} navContainer - The navigation container element
 */
function initializeNavigation(navContainer) {
  setupMobileMenu(navContainer);
  highlightCurrentPage(navContainer);
}

/**
 * Set up mobile menu toggle functionality
 * @param {HTMLElement} navContainer - The navigation container element
 */
function setupMobileMenu(navContainer) {
  const menuToggle = navContainer.querySelector(".navbar__menu-toggle");
  const navLinks = navContainer.querySelector(".navbar__links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      // Toggle active class on menu toggle
      this.classList.toggle("navbar__menu-toggle--active");

      // Toggle active class on navigation links
      navLinks.classList.toggle("navbar__links--active");

      // Toggle menu-open class on body to prevent scrolling
      document.body.classList.toggle("menu-open");
    });

    // Close menu when clicking on a link
    const links = navContainer.querySelectorAll(".navbar__link");
    links.forEach((link) => {
      link.addEventListener("click", function () {
        // Only do this if the mobile menu is visible
        if (window.innerWidth <= 768) {
          menuToggle.classList.remove("navbar__menu-toggle--active");
          navLinks.classList.remove("navbar__links--active");
          document.body.classList.remove("menu-open");
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      // Only do this if the mobile menu is visible and active
      if (
        window.innerWidth <= 768 &&
        navLinks.classList.contains("navbar__links--active") &&
        !navContainer.contains(event.target)
      ) {
        menuToggle.classList.remove("navbar__menu-toggle--active");
        navLinks.classList.remove("navbar__links--active");
        document.body.classList.remove("menu-open");
      }
    });

    // Close menu when window is resized above mobile breakpoint
    window.addEventListener("resize", function () {
      if (
        window.innerWidth > 768 &&
        navLinks.classList.contains("navbar__links--active")
      ) {
        menuToggle.classList.remove("navbar__menu-toggle--active");
        navLinks.classList.remove("navbar__links--active");
        document.body.classList.remove("menu-open");
      }
    });
  }
}

/**
 * Highlight the current page in the navigation
 * @param {HTMLElement} navContainer - The navigation container element
 */
function highlightCurrentPage(navContainer) {
  // Get current page from URL
  const currentPath = window.location.pathname;
  const pageName = currentPath.split("/").pop().split(".")[0];

  // Handle empty path or index
  const currentPage =
    pageName === "" || pageName === "index" ? "index" : pageName;

  // Find links and set active class
  const navLinks = navContainer.querySelectorAll("[data-nav-link]");
  navLinks.forEach((link) => {
    // Get the navigation identifier
    const navIdentifier = link.getAttribute("data-nav-link");

    // Clear any existing active class
    link.classList.remove("navbar__link--active");

    // Set active class based on current page
    if (navIdentifier === currentPage) {
      link.classList.add("navbar__link--active");
    }
  });
}

// Initialize the navigation component
initComponent(
  "navigation-container",
  "components/navigation/navigation.html",
  "main-navigation",
  initializeNavigation
);
