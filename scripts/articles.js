/**
 * @fileoverview Articles listing page functionality
 * Handles loading, filtering, and sorting of articles
 * @version 1.0.0
 */

document.addEventListener("DOMContentLoaded", () => {
  initializeArticlesPage();
});

/**
 * Initialize the articles page functionality
 */
async function initializeArticlesPage() {
  try {
    // Load article data
    const articles = await loadArticles();

    // Set up filter buttons
    setupFilterButtons(articles);

    // Set up sort functionality
    setupSorting();

    // Render all articles (default state)
    renderArticles(articles);
  } catch (error) {
    console.error("Error initializing articles page:", error);
    showErrorMessage();
  }
}

/**
 * Load articles from the JSON data file
 * @returns {Promise<Array>} Articles data
 */
async function loadArticles() {
  try {
    const response = await fetch("data/articles/index.json");
    if (!response.ok) {
      throw new Error(`Failed to load articles: ${response.status}`);
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error loading articles:", error);
    throw error;
  }
}

/**
 * Setup filter buttons with correct counts and event listeners
 * @param {Array} articles - Articles data
 */
function setupFilterButtons(articles) {
  const filterButtons = document.querySelectorAll(".articles__filter-btn");
  const categoryCounts = getCategoryCounts(articles);

  // Update filter button counts
  filterButtons.forEach((button) => {
    const category = button.getAttribute("data-category");
    const countElement = button.querySelector(".articles__filter-count");

    if (category === "all") {
      countElement.textContent = `(${articles.length})`;
    } else {
      const count = categoryCounts[category.toLowerCase()] || 0;
      countElement.textContent = `(${count})`;

      // Hide buttons with 0 articles
      if (count === 0) {
        button.style.display = "none";
      }
    }
  });

  // Add click event listeners
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Filter articles
      const category = button.getAttribute("data-category");
      filterArticles(category, articles);
    });
  });
}

/**
 * Get counts for each category
 * @param {Array} articles - Articles data
 * @returns {Object} Counts by category
 */
function getCategoryCounts(articles) {
  const counts = {};

  articles.forEach((article) => {
    const category = article.category.toLowerCase();
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
}

/**
 * Filter articles by category
 * @param {string} category - Category to filter by
 * @param {Array} articles - All articles
 */
function filterArticles(category, articles) {
  let filteredArticles = articles;

  // If category is not "all", filter the articles
  if (category.toLowerCase() !== "all") {
    filteredArticles = articles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get current sort method and apply it
  const activeSort = document.querySelector(".articles__sort-option.active");
  const sortMethod = activeSort
    ? activeSort.getAttribute("data-sort")
    : "newest";

  // Sort and render filtered articles
  const sortedArticles = sortArticles(filteredArticles, sortMethod);
  renderArticles(sortedArticles);
}

/**
 * Setup sorting functionality
 */
function setupSorting() {
  const sortButton = document.querySelector(".articles__sort-btn");
  const sortDropdown = document.querySelector(".articles__sort-dropdown");
  const sortOptions = document.querySelectorAll(".articles__sort-option");

  // Toggle dropdown on button click
  sortButton.addEventListener("click", () => {
    sortDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".articles__sort") &&
      sortDropdown.classList.contains("active")
    ) {
      sortDropdown.classList.remove("active");
    }
  });

  // Handle sort option selection
  sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      sortOptions.forEach((opt) => opt.classList.remove("active"));

      // Add active class to clicked option
      option.classList.add("active");

      // Close dropdown
      sortDropdown.classList.remove("active");

      // Update sort button text
      const sortText = option.textContent;
      sortButton.querySelector(".articles__sort-text").textContent =
        "Sort: " + sortText;

      // Get current filter and apply sort
      const activeFilter = document.querySelector(
        ".articles__filter-btn.active"
      );
      const category = activeFilter.getAttribute("data-category");

      // Get all articles and apply both filter and sort
      fetchAndUpdateArticles(category, option.getAttribute("data-sort"));
    });
  });
}

/**
 * Fetch articles and update with current filter and sort
 * @param {string} category - Category to filter by
 * @param {string} sortMethod - Sort method to apply
 */
async function fetchAndUpdateArticles(category, sortMethod) {
  try {
    const articles = await loadArticles();
    let filteredArticles = articles;

    // Apply filter if not "all"
    if (category.toLowerCase() !== "all") {
      filteredArticles = articles.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort and render articles
    const sortedArticles = sortArticles(filteredArticles, sortMethod);
    renderArticles(sortedArticles);
  } catch (error) {
    console.error("Error updating articles:", error);
  }
}

/**
 * Sort articles by date
 * @param {Array} articles - Articles to sort
 * @param {string} method - Sort method ("newest" or "oldest")
 * @returns {Array} Sorted articles
 */
function sortArticles(articles, method) {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (method === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
}

/**
 * Render articles to the grid
 * @param {Array} articles - Articles to render
 */
function renderArticles(articles) {
  const grid = document.getElementById("articles-grid");

  // Clear existing content
  grid.innerHTML = "";

  // If no articles match the filter
  if (articles.length === 0) {
    grid.innerHTML = `
      <div class="articles__empty">
        <p>No articles found matching your criteria.</p>
      </div>
    `;
    return;
  }

  // Create and append article cards
  articles.forEach((article) => {
    const card = createArticleCard(article);
    grid.appendChild(card);
  });
}

/**
 * Create an article card element
 * @param {Object} article - Article data
 * @returns {HTMLElement} Article card element
 */
function createArticleCard(article) {
  const card = document.createElement("div");
  card.className = "article-card";

  card.innerHTML = `
    <a href="article.html?id=${article.id}" class="article-card__link">
      <div class="article-card__image-container">
        <img src="${article.featuredImage}" alt="${article.title}" class="article-card__image">
      </div>
      <div class="article-card__content">
        <div class="article-card__meta">
          <span class="article-card__date">${article.date}</span>
          <span class="article-card__category">${article.category}</span>
        </div>
        <h3 class="article-card__title">${article.title}</h3>
        <p class="article-card__excerpt">${article.excerpt}</p>
        <span class="article-card__read-more">Read more</span>
      </div>
    </a>
  `;

  return card;
}

/**
 * Show error message when articles cannot be loaded
 */
function showErrorMessage() {
  const grid = document.getElementById("articles-grid");

  grid.innerHTML = `
    <div class="articles__empty">
      <p>There was an error loading the articles. Please try again later.</p>
    </div>
  `;
}
