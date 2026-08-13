# Neon - Tattoo Artist Landing Page

A modern, dark-themed landing page for Neon, a tattoo artist based in Tel Aviv-Yaffo specializing in custom black & grey tattoos inspired by dark fantasy and organic design.

## Features

- **Bilingual (Hebrew / English)**: Hebrew is the default locale at `/` with full RTL support; English lives at `/en/`. Footer language switcher links both versions.
- **Hero Section**: Full-screen video background with parallax scrolling effect
- **About Section**: Artist biography with feature cards highlighting specialties
- **Gallery**: Infinite horizontal marquee showcasing tattoo work
- **Booking System**: Multi-step consultation booking form with modal interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Preloader**: Animated loading screen with progress indicator
- **Google Analytics**: Integrated tracking via Google Tag Manager

## Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Custom properties, animations, responsive design
- **JavaScript (Vanilla)**: No frameworks, pure JS for interactivity
- **Google Fonts**: Cormorant Garamond (Latin display), Inter (Latin body), Heebo (Hebrew fallback)

## Project Structure

```
lionrab-lp/
├── index.html          # Hebrew homepage (RTL, default at /)
├── en/
│   └── index.html      # English homepage (LTR at /en/)
├── styles.css          # All styling and responsive breakpoints (RTL-safe logical properties)
├── script.js           # Interactive functionality
├── assets/
│   ├── images/         # Gallery images (WebP)
│   ├── videos/         # Hero background video
│   ├── hero.png        # Artist portrait / social share image
│   ├── hero.webp       # Hero video poster
│   └── about.webp      # About section artist image
├── CNAME               # Custom domain configuration
├── sitemap.xml         # Sitemap with hreflang alternates (he/en)
├── robots.txt          # Points crawlers to the sitemap
├── favicon.png         # Site icon
├── apple-touch-icon.png # iOS home-screen icon
└── README.md           # Project documentation
```

## Key Components

### Hero Section
- Video background with poster fallback
- Parallax scrolling effect (reduced on touch devices)
- Animated scroll indicator
- Responsive typography with clamp() for fluid scaling

### About Section
- Artist biography and specialties
- Feature cards with SVG icons
- Positioned artist image with grayscale filter
- Gradient overlay for readability

### Gallery Section
- Infinite horizontal marquee animation built from two identical tracks (9 unique WebP images each) for a seamless ±50% loop
- RTL-mirrored animation for the Hebrew locale (`galleryMarqueeRTL` drifts right, LTR drifts left)
- Hover effects (grayscale to color, lift effect)
- Touch-optimized scrolling on mobile
- Custom scrollbar hiding
- Lightbox with prev/next navigation and keyboard/arrow support (RTL-aware arrows)

### Booking System
- Multi-step form (Placement → Size → Contact → Confirmation)
- Chip-based selection for body placement and size
- Progress indicator with step counter
- Modal with escape key and backdrop click to close
- Form validation before step progression

## CSS Custom Properties

```css
:root {
    --bg-color: #060606;
    --text-color: #f5f2eb;
    --accent-color: #e9e1d3;
    --border-color: rgba(255, 255, 255, 0.15);
    --font-display: 'Cormorant Garamond', 'Heebo', serif;
    --font-secondary: 'Inter', 'Heebo', sans-serif;
    --font-body: 'Inter', 'Heebo', sans-serif;
    --global-padding: 1.5rem;
    --max-width: 1180px;
    --cta-height: 70px;
}
```

## Responsive Breakpoints

- **Desktop**: > 768px (full features, parallax effects, marquee animation)
- **Tablet**: 481px - 768px (adjusted spacing)
- **Mobile**: ≤ 480px (simplified layout, touch-optimized, enhanced parallax, auto-scroll gallery)

## JavaScript Functionality

### Preloader
- Tracks video and image loading
- Progress bar animation
- 5-second fallback timeout
- Smooth fade-out transition

### Parallax Effects
- Scroll-based transformations
- Touch device detection
- Enhanced parallax on mobile (increased offset for better effect)
- Video parallax on desktop and mobile
- requestAnimationFrame for smooth animation

### Booking Modal
- Open/close state management
- Body scroll lock when open
- Escape key and backdrop click handlers
- Step navigation with validation

### Form Validation
- Chip selection tracking
- "Other" input field toggle
- Next button enable/disable based on selection
- Step progress updates

## Performance Optimizations

- Lazy loading for gallery images
- Gallery images converted to WebP (~0.4 MB total, down from 21.4 MB JPGs)
- Hero video compressed to ~900 KB H.264 (down from 86.7 MB)
- Video preload="metadata"
- CSS will-change hints for animated elements
- Passive scroll event listeners
- Debounced scroll handling with requestAnimationFrame
- Reduced parallax on touch devices

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Google Analytics

The site includes Google Analytics tracking via Google Tag Manager:
- Property ID: G-F43X7Z2QBC
- Tracks page views and user interactions

## Deployment

The site is configured for GitHub Pages or similar static hosting:
- CNAME file for custom domain configuration
- Static assets in assets/ directory
- No build process required
- Simply upload files to any static hosting service

### Search Console

After deploying, submit both URLs in Google Search Console:
- `https://lionrab.ink/` (Hebrew)
- `https://lionrab.ink/en/` (English)

Both pages declare `hreflang` alternates and a shared sitemap (`sitemap.xml`) with `xhtml:link` alternates, so Google can map the two locales automatically.

## Customization

### Colors
Edit CSS custom properties in `:root` selector in styles.css

### Content
- Update text content in index.html
- Replace images in assets/images/
- Replace video in assets/videos/
- Update Google Analytics ID in index.html

### Typography
- Google Fonts are linked in index.html head
- Font family variables defined in styles.css

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Proper color contrast ratios
- Alt text for images
- Focus states for interactive elements

## Future Enhancements

Potential improvements:
- Contact form backend integration
- Social media links
- Client testimonials section
- FAQ content expansion

## License

This project is proprietary and owned by Neon Tattoo Artist.

## Contact

For inquiries about the tattoo artist, use the booking form on the website.
