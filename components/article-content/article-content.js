/**
 * @fileoverview Article content component for Jimmy Halvardsson Mountain Guide website
 * Uses JSON data files for content and loads based on URL parameter
 * @version 3.0.0
 */

/**
 * Initialize the article content component
 * @param {HTMLElement} articleContainer - The article container element
 */
function initializeArticleContent(articleContainer) {
  // Get article ID from URL query parameter
  const articleId = getArticleIdFromUrl();

  if (!articleId) {
    showArticleNotFound(articleContainer, new Error("No article ID specified"));
    return;
  }

  // First load the template, then load the article data
  loadArticleTemplate()
    .then((template) => {
      // Now load article data
      return loadArticleData(articleId).then((article) => {
        if (!article) {
          throw new Error("Article not found");
        }
        return { template, article };
      });
    })
    .then(({ template, article }) => {
      // Render article content with the template
      renderArticleContent(articleContainer, template, article);

      // Initialize social sharing
      initSocialSharing(articleContainer, article);

      // Load related articles
      loadRelatedArticles(articleContainer, article);

      // Update page title, breadcrumb, and meta tags
      updatePageDetails(article);
    })
    .catch((error) => {
      console.error("Error loading article:", error);
      showArticleNotFound(articleContainer, error);
    });
}

/**
 * Get article ID from URL query parameter
 * @returns {string|null} Article ID or null if not found
 */
function getArticleIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

/**
 * Load the article template HTML
 * @returns {Promise<string>} The template HTML
 */
async function loadArticleTemplate() {
  try {
    const response = await fetch(
      "components/article-content/article-content.html"
    );
    if (!response.ok) {
      throw new Error(`Failed to load article template: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error loading article template:", error);
    throw error;
  }
}

/**
 * Load article data from JSON file
 * @param {string} articleId - Article ID
 * @returns {Promise<Object|null>} Article data or null if not found
 */
async function loadArticleData(articleId) {
  try {
    // First, try to load the specific article JSON directly
    const articleResponse = await fetch(`data/articles/${articleId}.json`);

    if (articleResponse.ok) {
      return await articleResponse.json();
    }

    // If that fails, try to find it in the index
    const indexResponse = await fetch("data/articles/index.json");
    if (!indexResponse.ok) {
      throw new Error(`Failed to load article index: ${indexResponse.status}`);
    }

    const articlesIndex = await indexResponse.json();

    // Find the article in the index
    const articleMeta = articlesIndex.articles.find(
      (article) => article.id === articleId || article.slug === articleId
    );

    if (!articleMeta) {
      console.error(`Article not found in index: ${articleId}`);
      return null;
    }

    // Try loading with the id from the index
    const secondAttemptResponse = await fetch(
      `data/articles/${articleMeta.id}.json`
    );
    if (!secondAttemptResponse.ok) {
      throw new Error(
        `Failed to load article: ${secondAttemptResponse.status}`
      );
    }

    return await secondAttemptResponse.json();
  } catch (error) {
    console.error("Error loading article data:", error);
    throw error;
  }
}

/**
 * Show article not found message
 * @param {HTMLElement} container - Container element
 * @param {Error} [error] - Optional error object
 */
function showArticleNotFound(container, error) {
  container.innerHTML = `
    <div class="article__not-found">
      <h1>Article Not Found</h1>
      <p>Sorry, we couldn't find the article you're looking for.</p>
      <a href="articles.html" class="btn btn--primary">Back to Articles</a>
      ${
        error
          ? `<p class="article__error-message">Error: ${error.message}</p>`
          : ""
      }
    </div>
  `;
}

/**
 * Render article content
 * @param {HTMLElement} container - Container element
 * @param {string} template - HTML template
 * @param {Object} article - Article data
 */
function renderArticleContent(container, template, article) {
  // Replace placeholders in template with article data
  let articleHTML = template
    .replace(/{{date}}/g, article.date)
    .replace(/{{category}}/g, article.category)
    .replace(/{{readingTime}}/g, article.readingTime)
    .replace(/{{title}}/g, article.title)
    .replace(/{{authorImage}}/g, article.author.image)
    .replace(/{{authorName}}/g, article.author.name)
    .replace(/{{authorTitle}}/g, article.author.title)
    .replace(/{{featuredImage}}/g, article.featuredImage)
    .replace(/{{imageCaption}}/g, article.imageCaption || "");

  // Insert the HTML into the container
  container.innerHTML = articleHTML;

  // Get the content container
  const contentContainer = container.querySelector(".article__content");

  // Process each content block
  article.content.forEach((block) => {
    switch (block.type) {
      case "paragraph":
        const p = document.createElement("p");
        p.innerHTML = block.content;
        contentContainer.appendChild(p);
        break;

      case "heading":
        const heading = document.createElement(`h${block.level}`);
        heading.innerHTML = block.content;
        contentContainer.appendChild(heading);
        break;

      case "image":
        const imgContainer = document.createElement("figure");
        imgContainer.className = "article__content-figure";

        const img = document.createElement("img");
        img.src = block.src;
        img.alt = block.alt || "";
        img.className = "article__content-image";

        imgContainer.appendChild(img);

        if (block.caption) {
          const caption = document.createElement("figcaption");
          caption.className = "article__content-caption";
          caption.innerHTML = block.caption;
          imgContainer.appendChild(caption);
        }

        contentContainer.appendChild(imgContainer);
        break;

      case "list":
        const list = document.createElement(
          block.style === "ordered" ? "ol" : "ul"
        );
        list.className = `article__content-${block.style}-list`;

        block.items.forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = item;
          list.appendChild(li);
        });

        contentContainer.appendChild(list);
        break;

      case "blockquote":
        const blockquote = document.createElement("blockquote");
        blockquote.className = "article__content-blockquote";
        blockquote.innerHTML = `<p>${block.content}</p>`;
        contentContainer.appendChild(blockquote);
        break;

      default:
        console.warn(`Unknown content block type: ${block.type}`);
    }
  });

  // Render tags
  const tagsContainer = container.querySelector(".article__tags-list");

  article.tags.forEach((tag) => {
    const tagElement = document.createElement("a");
    tagElement.href = `articles.html?tag=${tag}`;
    tagElement.className = "article__tag";
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);
  });
}

/**
 * Initialize social sharing
 * @param {HTMLElement} container - Container element
 * @param {Object} article - Article data
 */
function initSocialSharing(container, article) {
  const shareButtons = container.querySelectorAll(".article__share-button");

  shareButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const currentUrl = window.location.href;
      const articleTitle = article.title;

      if (button.classList.contains("article__share-button--facebook")) {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        );
      } else if (button.classList.contains("article__share-button--twitter")) {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl
          )}&text=${encodeURIComponent(articleTitle)}`,
          "_blank"
        );
      } else if (button.classList.contains("article__share-button--linkedin")) {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        );
      } else if (button.classList.contains("article__share-button--copy")) {
        // Copy URL to clipboard
        navigator.clipboard.writeText(currentUrl).then(() => {
          // Show success message
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;

          // Reset after 2 seconds
          setTimeout(() => {
            button.innerHTML = originalHTML;
          }, 2000);
        });
      }
    });
  });
}

/**
 * Load related articles
 * @param {HTMLElement} container - Container element
 * @param {Object} article - Article data
 */
async function loadRelatedArticles(container, article) {
  const relatedContainer = container.querySelector(
    "#related-articles-container"
  );

  try {
    // Load the article index to get related articles data
    const indexResponse = await fetch("data/articles/index.json");
    if (!indexResponse.ok) {
      throw new Error(`Failed to load article index: ${indexResponse.status}`);
    }

    const articlesIndex = await indexResponse.json();

    // Find related articles in the index
    const relatedArticles = article.relatedArticles
      .map((relatedId) => {
        return articlesIndex.articles.find(
          (indexArticle) =>
            indexArticle.id === relatedId || indexArticle.slug === relatedId
        );
      })
      .filter((article) => article !== undefined);

    // Clear container
    relatedContainer.innerHTML = "";

    // If no related articles found
    if (relatedArticles.length === 0) {
      container.querySelector(".article__related").style.display = "none";
      return;
    }

    // Create article cards
    relatedArticles.forEach((relatedArticle) => {
      const card = document.createElement("div");
      card.className = "article-card";
      card.innerHTML = `
        <a href="article.html?id=${relatedArticle.id}" class="article-card__link">
          <div class="article-card__image-container">
            <img src="${relatedArticle.featuredImage}" alt="${relatedArticle.title}" class="article-card__image">
          </div>
          <div class="article-card__content">
            <div class="article-card__meta">
              <span class="article-card__date">${relatedArticle.date}</span>
              <span class="article-card__category">${relatedArticle.category}</span>
            </div>
            <h3 class="article-card__title">${relatedArticle.title}</h3>
            <p class="article-card__excerpt">${relatedArticle.excerpt}</p>
            <span class="article-card__read-more">Read more</span>
          </div>
        </a>
      `;
      relatedContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading related articles:", error);
    container.querySelector(".article__related").style.display = "none";
  }
}

/**
 * Update page title, breadcrumb, and meta tags
 * @param {Object} article - Article data
 */
function updatePageDetails(article) {
  // Update page title
  document.title = `${article.title} - Jimmy Halvardsson`;

  // Update breadcrumb
  const breadcrumbTitle = document.getElementById("breadcrumb-article-title");
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = article.title;
  }

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", article.excerpt);
  }

  // Update Open Graph tags if they exist
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", article.title);
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescription) {
    ogDescription.setAttribute("content", article.excerpt);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    // Convert relative path to absolute URL
    const baseUrl = window.location.origin;
    const imagePath = article.featuredImage.startsWith("/")
      ? article.featuredImage
      : `/${article.featuredImage}`;
    ogImage.setAttribute("content", `${baseUrl}${imagePath}`);
  }

  // Set canonical URL for SEO
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", window.location.href);
}

// Initialize the article content component
initComponent(
  "article-content-container",
  null, // No HTML template - we load it separately
  "article-content",
  initializeArticleContent
);
