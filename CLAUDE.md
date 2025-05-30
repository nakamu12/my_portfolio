# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese engineer portfolio website built as a static site showcasing robotics, AI development skills, and professional achievements. The site targets freelance opportunities and tech community visibility.

## Architecture

### Component-Based Structure
- **Main entry**: `index.html` contains placeholder divs for each section
- **Component system**: HTML components in `/components/` directory are dynamically loaded via `js/components-loader.js`
- **Initialization flow**: Components load synchronously using XMLHttpRequest, then page initialization runs

### Key Files
- `js/components-loader.js`: Core component loading system using synchronous XHR
- `js/main.js`: Main functionality including AOS animations, smooth scrolling, navigation
- `js/hero-animation.js`: Hero section animations
- `js/link-preview.js`: Link preview functionality
- `css/style.css`: Complete styling with CSS custom properties

### Component Loading Order
Components load in this sequence: header → hero → about → skills → experience → projects → media → contact → footer

## Development

### No Build Process
This is a vanilla HTML/CSS/JavaScript site with no build tools or package manager. Open `index.html` directly in browser for development.

### Color Scheme
- Primary: `#0a1c2e` (Deep Navy Blue)
- Secondary: `#1d1d1f` (Near Black)  
- Accent: `#757575` (Silver/Light Gray)
- Highlight: `#3498db` (Blue)

### External Dependencies
- Font Awesome 6.4.0 (icons)
- AOS 2.3.4 (scroll animations)
- Google Fonts (Montserrat, Noto Sans JP, Roboto)

## File Organization

### Assets Structure
- `/assets/images/`: All images including achievements, certifications, projects, profile
- `/components/`: Modular HTML sections (header.html, hero.html, etc.)
- `/css/`: Single stylesheet (style.css)
- `/js/`: JavaScript modules

### Deployment
Designed for GitHub Pages deployment - static files served directly from main branch root.