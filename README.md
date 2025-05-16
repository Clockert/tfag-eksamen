Mountain Guide Website
Show Image
A professional website for Jimmy Halvardsson, mountain guide, featuring a component-based architecture with best practices in HTML, CSS, and JavaScript.
📋 Project Overview
This website was built as a final exam project, focusing on implementing best practices in front-end web development. The site features a custom component system, follows the BEM methodology for CSS, and uses vanilla JavaScript for interactivity.
🔍 Key Features

Component-Based Architecture: Modular approach to UI elements
BEM Methodology: Consistent and maintainable CSS
Responsive Design: Mobile-first approach
Dynamic Content Loading: Components load asynchronously
Accessible UI: Semantic HTML and ARIA attributes

🛠️ Technology Stack

HTML5 - Semantic markup
CSS3 - Modern styling with variables, flexbox, and grid
JavaScript - Vanilla JS with ES6+ features
No frameworks - Pure implementation to demonstrate core skills

🏗️ Project Structure
/
├── index.html # Homepage
├── pages/ # Other HTML pages
│ ├── about.html
│ ├── services.html
│ ├── articles.html
│ └── contact.html
│
├── assets/ # Static assets
│ ├── images/
│ │ └── ...
│ └── logo/
│ ├── logo_icon.svg
│ └── logo_full.svg
│
├── styles/ # Global styles
│ ├── main.css # Main CSS file (imports all others)
│ ├── base.css # Base styles and CSS variables
│ └── utilities.css # Utility classes
│
├── components/ # Component files
│ ├── component-loader.js # Core component loader
│ │
│ ├── navigation/ # Navigation component
│ │ ├── navigation.html
│ │ ├── navigation.css
│ │ └── navigation.js
│ │
│ ├── footer/ # Footer component
│ │ ├── footer.html
│ │ ├── footer.css
│ │ └── footer.js
│ │
│ └── [other components]/ # Additional components
│
└── scripts/ # Global scripts
└── main.js # Main JavaScript file
🚀 Getting Started
Prerequisites

A modern web browser
A local development server (optional but recommended)

Installation

Clone the repository:
bashgit clone https://github.com/your-username/mountain-guide-website.git

Navigate to the project directory:
bashcd mountain-guide-website

Start a local development server:
Using Python:
bash# Python 3
python -m http.server

# Python 2

python -m SimpleHTTPServer
Using Node.js (with http-server package):
bash# Install http-server globally if you haven't already
npm install -g http-server

# Start the server

http-server

Open your browser and navigate to http://localhost:8000 or the port provided by your server.

🧩 Component System
The website uses a custom component system to manage UI elements. Each component consists of:

HTML template (componentName.html)
CSS styles (componentName.css)
JavaScript behavior (componentName.js)

How to Use Components

Create a container in your HTML:
html<div id="component-name-container"></div>

Include the component script:
html<script src="components/component-name/component-name.js"></script>

The component will automatically load and initialize.

Creating a New Component

Create a new folder in the components directory
Add three files:

component-name.html - The HTML template with BEM classes
component-name.css - Component styles using BEM
component-name.js - Component initialization

Initialize the component in its JS file:
javascriptinitComponent(
"component-name-container",
"components/component-name/component-name.html",
"component-id",
initializeFunction
);

Import the CSS in your main.css:
css@import url("../components/component-name/component-name.css");

🎨 CSS Methodology
This project follows the BEM (Block, Element, Modifier) methodology for CSS:

Block: A standalone entity that is meaningful on its own (e.g., .navbar, .hero)
Element: A part of a block that has no standalone meaning (e.g., .navbar**logo, .hero**title)
Modifier: A flag on a block or element that changes appearance (e.g., .btn--primary, .navbar\_\_link--active)

Example:
html<div class="service">

  <div class="service__icon"><!-- SVG icon --></div>
  <h3 class="service__title">Mountain Climbing</h3>
  <p class="service__description">Expert guided climbing expeditions...</p>
  <a href="#" class="service__link">Learn More</a>
</div>
See the BEM Methodology Guide for more details.
📱 Responsive Design
The website follows a mobile-first approach:

Base styles are designed for mobile devices
Media queries add complexity for larger screens
Breakpoints:

Small: Up to 640px
Medium: 641px to 768px
Large: 769px to 1024px
Extra Large: 1025px and up

🛡️ Browser Compatibility
The website is compatible with:

Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Opera (latest)
iOS Safari and Chrome (latest)
Android Chrome (latest)

📝 Development Guidelines
Code Style

Use 2-space indentation
Use semantic HTML elements
Follow BEM naming conventions for CSS
Use JSDoc comments for JavaScript functions
Keep files focused on a single responsibility

Git Workflow

Use feature branches for new functionality
Create descriptive commit messages
Merge to main branch only when features are complete

🌟 Future Enhancements

Add a blog/article system
Implement a contact form with validation
Create a photo gallery component
Add animations for smoother transitions
Integrate a headless CMS for content management

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Author
[Your Name] - [Your Email/Website/GitHub]
🙏 Acknowledgments

Jimmy Halvardsson for the opportunity to create this website
[Font source] for the Schibsted Grotesk font
