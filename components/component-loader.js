// This file is intentionally left blank./**
/* Component Loader System
 * Handles loading and initializing components across the website
 * @version 1.0.0
 */

/**
 * ComponentLoader - Main class for handling component loading
 */
class ComponentLoader {
  /**
   * Create a new ComponentLoader instance
   */
  constructor() {
    this.loadedComponents = new Map();
    this.componentCallbacks = new Map();
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
  }

  /**
   * Load a component into a container
   * @param {string} containerSelector - CSS selector for the container
   * @param {string} templatePath - Path to the HTML template
   * @param {string} componentId - Unique ID for the component
   * @returns {Promise} - Promise that resolves when component is loaded
   */
  async loadComponent(containerSelector, templatePath, componentId) {
    try {
      // Find the container element
      const container = document.querySelector(containerSelector);
      if (!container) {
        console.error(`Container not found: ${containerSelector}`);
        return;
      }

      // Fetch the HTML template
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${templatePath}`);
      }

      // Get the HTML content
      const html = await response.text();

      // Insert the HTML into the container
      container.innerHTML = html;

      // Register this component as loaded
      this.loadedComponents.set(componentId, {
        container: containerSelector,
        template: templatePath,
      });

      // Execute any registered callbacks for this component
      if (this.componentCallbacks.has(componentId)) {
        for (const callback of this.componentCallbacks.get(componentId)) {
          callback(container);
        }
      }

      return container;
    } catch (error) {
      console.error(`Error loading component: ${error.message}`);
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
  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", async () => {
    // Register initialization function as a callback
    window.componentLoader.registerCallback(componentId, initFunction);

    // Load the component
    await window.componentLoader.loadComponent(
      `#${containerId}`,
      templatePath,
      componentId
    );
  });
}
