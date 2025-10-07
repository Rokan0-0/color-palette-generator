# 🎨 Color Palette Generator Pro

A professional-grade color palette generator with advanced features for designers and developers. Create, customize, and export beautiful color schemes with ease.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow.svg)
![No Dependencies](https://img.shields.io/badge/dependencies-none-success.svg)

## ✨ Features

### 🎨 Core Features
- **6 Color Harmony Modes** - Random, Monochromatic, Analogous, Complementary, Triadic, Tetradic
- **Lock Individual Colors** - Keep colors you like while regenerating others
- **Drag & Drop Reordering** - Easily rearrange colors in your palette
- **One-Click Copy** - Click any color to copy its HEX code
- **Undo/Redo** - 20-step history for mistake-free editing
- **Color Naming** - Automatic color name identification

### 🚀 Advanced Features
- **📷 Image Color Extraction** - Upload any image and extract dominant colors
- **👁️ Color Blindness Simulation** - Test palettes in 4 different vision modes (Deuteranopia, Protanopia, Tritanopia, Grayscale)
- **♿ WCAG Accessibility Checker** - Ensure AA and AAA compliance for text contrast
- **🌈 Gradient Generator** - Create linear, radial, and conic gradients with multiple color stops
- **🎨 Advanced Color Picker** - Fine-tune colors with HSL and RGB sliders + number inputs
- **🔗 Share Palettes** - Generate unique URLs to share your palettes
- **💾 Unlimited Storage** - Save unlimited palettes and gradients (browser local storage)
- **🌓 Dark/Light Mode** - Full theme support with smooth transitions

### 📥 Export Formats
- **CSS Variables** - Ready-to-use CSS custom properties
- **SCSS Variables** - Sass/SCSS variable format
- **JSON** - Complete color data with metadata
- **SVG** - Vector swatch file
- **Tailwind Config** - Tailwind CSS configuration
- **Adobe ASE** - Adobe Swatch Exchange format

### ⌨️ Keyboard Shortcuts
- `Space` - Generate new palette
- `S` - Save current palette
- `E` - Toggle export menu
- `Ctrl+Z` - Undo last change
- `T` - Toggle dark/light theme
- `Escape` - Close modals/sidebar
- Click color - Copy to clipboard
- Drag color - Reorder colors

## 🚀 Quick Start

### Online Demo
👉 **[Try it now](https://yourusername.github.io/color-palette-generator-pro/)**

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/color-palette-generator-pro.git

# Navigate to directory
cd color-palette-generator-pro

# Open in browser (no build required!)
open index.html
```

**That's it!** No dependencies, no build process, no npm install. Just pure HTML, CSS, and JavaScript.

## 📖 Usage Guide

### Generating Palettes

1. **Select a harmony mode** from the dropdown (Random, Monochromatic, etc.)
2. **Click "Generate"** or press `Space` to create a new palette
3. **Lock colors** you want to keep by clicking the 🔓 icon
4. **Generate again** to refresh only unlocked colors

### Extracting Colors from Images

1. Click the **"From Image"** button
2. Select any image file from your computer
3. The app extracts 5 dominant colors automatically
4. Edit individual colors if needed

### Creating Gradients

1. Navigate to the **Gradient** page
2. Add or remove color stops as needed
3. Choose gradient type (Linear, Radial, Conic)
4. Adjust angle, position, and stop positions
5. **Export CSS** code or save for later

### Editing Colors

1. Click the **🎨 icon** on any color
2. Use **HSL sliders** for hue-based adjustments
3. Use **RGB sliders** for precise control
4. Enter **HEX codes** directly
5. All formats sync in real-time

### Testing Accessibility

1. Open the **sidebar** (click ⚙️ More)
2. View **WCAG contrast ratios** between adjacent colors
3. Check for AA (4.5:1) and AAA (7:1) compliance
4. Apply **color blindness filters** to test visibility

### Sharing Palettes

1. Click the **"Share"** button
2. Copy the unique URL
3. Share with anyone - palette loads automatically
4. No account or login required

## 🏗️ Project Structure

```
color-palette-generator-pro/
├── index.html              # Main palette page
├── gradient.html           # Gradient generator
├── settings.html           # Settings page
├── css/
│   ├── main.css           # Base styles & layout
│   ├── components.css     # Component-specific styles
│   └── themes.css         # Theme definitions
├── js/
│   ├── utils/
│   │   ├── colorUtils.js  # Color conversion functions
│   │   └── storage.js     # LocalStorage management
│   ├── components/
│   │   ├── colorPicker.js # Color picker component
│   │   ├── palette.js     # Palette management
│   │   └── export.js      # Export functionality
│   ├── main.js            # Main application logic
│   └── gradient.js        # Gradient page logic
├── README.md
└── .gitignore
```

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Custom Properties
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Canvas API** - Image color extraction
- **LocalStorage API** - Data persistence
- **Drag & Drop API** - Color reordering

**Zero dependencies!** Everything runs in the browser.

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome  | 90+            | ✅ Fully Supported |
| Firefox | 88+            | ✅ Fully Supported |
| Safari  | 14+            | ✅ Fully Supported |
| Edge    | 90+            | ✅ Fully Supported |
| Opera   | 76+            | ✅ Fully Supported |

### Required Browser Features
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6+ JavaScript
- LocalStorage API
- Canvas API
- FileReader API
- Drag and Drop API

## 📱 Responsive Design

Works perfectly on:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

## 🎓 API Reference

### ColorUtils

```javascript
// Convert colors
ColorUtils.hexToRgb('#FF0000')           // {r: 255, g: 0, b: 0}
ColorUtils.rgbToHex(255, 0, 0)           // '#FF0000'
ColorUtils.rgbToHsl(255, 0, 0)           // {h: 0, s: 100, l: 50}
ColorUtils.hslToRgb(0, 100, 50)          // {r: 255, g: 0, b: 0}
ColorUtils.hslToHex(0, 100, 50)          // '#FF0000'

// Analyze colors
ColorUtils.getContrastRatio('#000', '#FFF')  // 21
ColorUtils.getTextColor('#FF0000')           // '#FFFFFF'
ColorUtils.getColorName('#FF0000')           // 'Red'

// Generate colors
ColorUtils.generateRandomColor()              // '#A3B2C4'
ColorUtils.generatePalette('analogous', 5)   // ['#...', ...]

// Extract from image
ColorUtils.extractColorsFromImage(file, (colors) => {
    console.log(colors); // ['#...', '#...', ...]
})
```

### Storage

```javascript
// Palettes
Storage.savePalette(['#FF0000', '#00FF00'])
Storage.getSavedPalettes()                    // [{colors: [...], timestamp: ...}]
Storage.deletePalette(0)
Storage.clearAllPalettes()

// Gradients
Storage.saveGradient({type: 'linear', ...})
Storage.getSavedGradients()

// Theme
Storage.saveTheme('dark')
Storage.getTheme()                            // 'dark'
```

### Palette

```javascript
Palette.init()                                // Initialize with random palette
Palette.generate('monochromatic')            // Generate new palette
Palette.toggleLock(0)                        // Lock/unlock color at index
Palette.save()                               // Save to storage
Palette.load(['#FF0000', ...])              // Load specific palette
Palette.undo()                               // Undo last change
Palette.share()                              // Show share modal
```

## 🚀 Deployment

### GitHub Pages (Recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to Settings → Pages → Source: main branch → Save
```

Your site will be live at: `https://USERNAME.github.io/REPO/`

### Other Hosting Options

- **Netlify** - Drag and drop the folder
- **Vercel** - Connect GitHub repository
- **Firebase Hosting** - `firebase deploy`
- **Any Static Host** - Just upload the files!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Report Bugs** - Open an issue
2. 💡 **Suggest Features** - Open an issue with enhancement label
3. 🔀 **Submit Pull Requests** - Fork, create branch, submit PR
4. 📖 **Improve Documentation** - Fix typos, add examples
5. ⭐ **Star the Project** - Show your support!

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/color-palette-generator-pro.git
cd color-palette-generator-pro

# Start local server
python -m http.server 8000
# OR
npx http-server

# Open browser
open http://localhost:8000
```

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🙏 Acknowledgments

- Color theory resources and inspiration
- The amazing open-source community
- All contributors and users
- Design tools: Adobe Color, Coolors, Color Hunt

## 📧 Contact & Support

- 📧 **Email**: dporteiru@gmail.com
- 🐦 **Twitter**: [https://x.com/DamilolaPorter](https://twitter.com/yourhandle)
- 💬 **Discord**: [Join Server](#)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/color-palette-generator-pro/issues)

## 🗺️ Roadmap

### Version 2.1 (Upcoming)
- [ ] Color palette library with popular presets
- [ ] Export to Adobe Illustrator (.ai)
- [ ] Color palette trends by season
- [ ] Advanced color theory visualizations

### Version 3.0 (Future)
- [ ] AI-powered color suggestions
- [ ] Collaborative palette editing
- [ ] Browser extension for color picking
- [ ] Mobile app (iOS/Android)
- [ ] REST API for developers

## 📊 Stats

- 🎨 **6** Color harmony modes
- 📥 **6** Export formats
- 👁️ **4** Color blindness simulations
- ♿ **2** WCAG compliance levels
- ⌨️ **6** Keyboard shortcuts
- 💾 **∞** Saved palettes (unlimited)

## ⭐ Show Your Support

If you like this project:
- ⭐ **Star the repository**
- 🐛 **Report bugs**
- 💡 **Suggest features**
- 🔀 **Submit pull requests**
- 📢 **Share with others**
- ☕ [https://buymeacoffee.com/rokan](https://buymeacoffee.com/yourhandle)

---

<div align="center">
  <strong>Built with ❤️ for the design community</strong>
  <br>
  <sub>Made by <a href="https://github.com/Rokan0-0">Rokan</a></sub>
</div>

---

[⬆ Back to top](#-color-palette-generator-pro)