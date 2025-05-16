/**
 * Component Loader System
 * Handles loading and initializing components across the website
 * @Clockert
 */

/**
 * ComponentLoader - Main class for handling component loading
 */
class ComponentLoader {
  /**
   * Create a new ComponentLoader instance
   */
  constructor() {
    // Map to store loaded components
    this.loadedComponents = new Map();
    // Map to store callbacks for components
    this.componentCallbacks = new Map();

    // Debug mode (can be toggled for development)
    this.debug = false;
  }

  /**
   * Toggle debug mode
   * @param {boolean} enabled - Enable or disable debug mode
   */
  setDebug(enabled) {
    this.debug = enabled;
  }

  /**
   * Log message in debug mode
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.debug) {
      console.log(`[ComponentLoader] ${message}`);
    }
  }

  /**
   * Register a callback function to be called after a component is loaded
   * @param {string} componentId - The ID of the component
   * @param {Function} callback - Function to call after component is loaded
   */
  registerCallback(componentId, callback) {
    if (!this.componentCallbacks.has(componentId)) {
      this.componentCallbacks.set(componentId, []);
    }
    this.componentCallbacks.get(componentId).push(callback);
    this.log(`Registered callback for component '${componentId}'`);
  }

  /**
   * Load a component into a container
   * @param {string} containerSelector - CSS selector for the container
   * @param {string} templatePath - Path to the HTML template
   * @param {string} componentId - Unique ID for the component
   * @returns {Promise<HTMLElement|null>} - Promise that resolves with the container element or null on error
   */
  async loadComponent(containerSelector, templatePath, componentId) {
    try {
      this.log(
        `Loading component '${componentId}' from '${templatePath}' into '${containerSelector}'`
      );

      // Find the container element
      const container = document.querySelector(containerSelector);
      if (!container) {
        throw new Error(`Container not found: ${containerSelector}`);
      }

      // Fetch the HTML template
      this.log(`Fetching template: ${templatePath}`);
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(
          `Failed to load template: ${templatePath} (${response.status}: ${response.statusText})`
        );
      }

      // Get the HTML content
      const html = await response.text();

      // Insert the HTML into the container
      container.innerHTML = html;
      this.log(`Component '${componentId}' HTML loaded successfully`);

      // Register this component as loaded
      this.loadedComponents.set(componentId, {
        container: containerSelector,
        template: templatePath,
      });

      // Execute any registered callbacks for this component
      if (this.componentCallbacks.has(componentId)) {
        const callbacks = this.componentCallbacks.get(componentId);
        this.log(
          `Executing ${callbacks.length} callback(s) for component '${componentId}'`
        );

        for (const callback of callbacks) {
          try {
            callback(container);
          } catch (callbackError) {
            console.error(
              `Error in callback for component '${componentId}':`,
              callbackError
            );
          }
        }
      }

      return container;
    } catch (error) {
      console.error(`Error loading component '${componentId}':`, error);
      return null;
    }
  }

  /**
   * Check if a component is loaded
   * @param {string} componentId - The ID of the component to check
   * @returns {boolean} - True if the component is loaded
   */
  isComponentLoaded(componentId) {
    return this.loadedComponents.has(componentId);
  }
}

// Create a global instance
window.componentLoader = window.componentLoader || new ComponentLoader();

/**
 * Helper function to initialize a component
 * @param {string} containerId - The ID of the container element
 * @param {string} templatePath - Path to the HTML template
 * @param {string} componentId - Unique ID for the component
 * @param {Function} initFunction - Initialization function to call after loading
 */
function initComponent(containerId, templatePath, componentId, initFunction) {
  // Make sure to wait for DOM content to be loaded before trying to find elements
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadComponentWithInit(
        containerId,
        templatePath,
        componentId,
        initFunction
      );
    });
  } else {
    // DOM is already ready
    loadComponentWithInit(containerId, templatePath, componentId, initFunction);
  }
}

/**
 * Internal function to handle component loading and initialization
 * @param {string} containerId - The ID of the container element
 * @param {string} templatePath - Path to the HTML template
 * @param {string} componentId - Unique ID for the component
 * @param {Function} initFunction - Initialization function to call after loading
 */
async function loadComponentWithInit(
  containerId,
  templatePath,
  componentId,
  initFunction
) {
  // Check if container exists
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found in the DOM`);
    return;
  }

  // Register initialization function as a callback
  window.componentLoader.registerCallback(componentId, initFunction);

  // Load the component
  try {
    await window.componentLoader.loadComponent(
      `#${containerId}`,
      templatePath,
      componentId
    );
  } catch (error) {
    console.error(`Failed to initialize component ${componentId}:`, error);
  }
}

// Enable debug mode during development - comment out for production
// window.componentLoader.setDebug(true);
