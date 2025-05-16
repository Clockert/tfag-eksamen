/**
 * Main JavaScript file for Jimmy Halvardsson Mountain Guide website
 * Handles global functionality across all pages
 * @version 1.0.0
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize lazy loading for images (if needed)
  initLazyLoading();

  // Other global initializations
  setupGlobalEventHandlers();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Don't scroll for links that don't actually point to an ID
      if (this.getAttribute("href") === "#") return;

      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Get height of the fixed header
        const headerHeight =
          document.querySelector(".header")?.offsetHeight || 0;

        // Calculate position, accounting for header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight - 20;

        // Perform smooth scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  // Check if browser supports native lazy loading
  if ("loading" in HTMLImageElement.prototype) {
    // Use native lazy loading
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  } else {
    // Fallback to IntersectionObserver
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll("img.lazy").forEach((img) => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      // Load all images immediately
      const lazyImages = document.querySelectorAll("img.lazy");
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.classList.remove("lazy");
      });
    }
  }
}

/**
 * Set up global event handlers
 */
function setupGlobalEventHandlers() {
  // Highlight active section on scroll
  if (document.querySelector(".section-nav")) {
    window.addEventListener("scroll", highlightActiveSection);
  }

  // Handle form submissions (if needed)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
  });
}

/**
 * Highlight the active section in navigation during scrolling
 */
function highlightActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".section-nav a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0;

    if (window.scrollY >= sectionTop - headerHeight - 50) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

/**
 * Handle form submission
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
  // This is a placeholder for form handling
  // In a real implementation, you would handle form validation and submission

  // Example form validation
  const form = e.target;
  const required = form.querySelectorAll("[required]");
  let valid = true;

  required.forEach((field) => {
    if (!field.value.trim()) {
      valid = false;
      field.classList.add("error");
    } else {
      field.classList.remove("error");
    }
  });

  if (!valid) {
    e.preventDefault();
    // Show error message
    const errorMessage =
      form.querySelector(".form-error-message") ||
      document.createElement("div");

    if (!form.querySelector(".form-error-message")) {
      errorMessage.classList.add("form-error-message");
      errorMessage.textContent = "Please fill in all required fields.";
      form.prepend(errorMessage);
    }
  }
}

// Enable debug mode for component loader during development
// Comment out before production
// window.componentLoader.setDebug(true);
