/**
 * @fileoverview Footer component for Jimmy Halvardsson Mountain Guide website
 * Uses BEM methodology for class naming
 * @version 1.0.0
 */

/**
 * Initialize footer functionality
 * @param {HTMLElement} footerContainer - The footer container element
 */
function initializeFooter(footerContainer) {
  updateCopyrightYear(footerContainer);
  setupLegalLinks(footerContainer);
}

/**
 * Updates the copyright year dynamically
 * @param {HTMLElement} footerContainer - The footer container element
 */
function updateCopyrightYear(footerContainer) {
  const yearElement = footerContainer.querySelector("#current-year");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
  }
}

/**
 * Setup behavior for legal links
 * @param {HTMLElement} footerContainer - The footer container element
 */
function setupLegalLinks(footerContainer) {
  // This is a placeholder for any future functionality related to legal links
  // For example, you might want to implement modal popups for privacy policy, etc.
  const legalLinks = footerContainer.querySelectorAll(".footer__legal-link");

  legalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // If the links aren't ready yet, prevent default navigation
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
        console.log("Legal page not available yet");
        // You could show a "coming soon" message here
      }
    });
  });
}

// Initialize the footer component
initComponent(
  "footer-container",
  "components/footer/footer.html",
  "main-footer",
  initializeFooter
);
