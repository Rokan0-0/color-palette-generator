// ========================================
// COLOR UTILITY FUNCTIONS
// ========================================

const ColorUtils = {
    /**
     * Convert HEX to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB to HEX
     */
    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('');
    },

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },

    /**
     * Convert HSL to HEX
     */
    hslToHex(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    /**
     * Get contrast ratio between two colors (WCAG)
     */
    getContrastRatio(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        
        const luminance = (rgb) => {
            const a = [rgb.r, rgb.g, rgb.b].map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        };

        const l1 = luminance(rgb1);
        const l2 = luminance(rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    },

    /**
     * Get text color (black or white) based on background
     */
    getTextColor(hex) {
        const rgb = this.hexToRgb(hex);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    },

    /**
     * Get color name based on hue
     */
    getColorName(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Handle grayscale colors
        if (hsl.s < 10) {
            if (hsl.l < 20) return 'Black';
            if (hsl.l > 80) return 'White';
            return 'Gray';
        }
        
        // Determine color name by hue
        const hue = hsl.h;
        if (hue < 15 || hue >= 345) return 'Red';
        if (hue < 45) return 'Orange';
        if (hue < 75) return 'Yellow';
        if (hue < 150) return 'Green';
        if (hue < 200) return 'Cyan';
        if (hue < 260) return 'Blue';
        if (hue < 290) return 'Purple';
        if (hue < 330) return 'Pink';
        return 'Red';
    },

    /**
     * Generate random color
     */
    generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },

    /**
     * Generate color palette based on harmony mode
     */
    generatePalette(mode, numColors = 5) {
        const baseHue = Math.random() * 360;
        const colors = [];

        switch(mode) {
            case 'monochromatic':
                for (let i = 0; i < numColors; i++) {
                    const lightness = 20 + (i * 60 / numColors);
                    colors.push(this.hslToHex(baseHue, 70, lightness));
                }
                break;
            
            case 'analogous':
                for (let i = 0; i < numColors; i++) {
                    const hue = (baseHue + (i * 30) - 60) % 360;
                    colors.push(this.hslToHex(hue, 65, 50 + Math.random() * 20));
                }
                break;
            
            case 'complementary':
                colors.push(this.hslToHex(baseHue, 70, 50));
                colors.push(this.hslToHex((baseHue + 180) % 360, 70, 50));
                for (let i = 2; i < numColors; i++) {
                    colors.push(this.hslToHex(baseHue + (i - 1) * 30, 60, 60));
                }
                break;
            
            case 'triadic':
                for (let i = 0; i < numColors; i++) {
                    const hue = (baseHue + i * 120) % 360;
                    colors.push(this.hslToHex(hue, 65, 50 + Math.random() * 15));
                }
                break;
            
            case 'tetradic':
                const angles = [0, 90, 180, 270];
                for (let i = 0; i < numColors; i++) {
                    const hue = (baseHue + angles[i % 4]) % 360;
                    colors.push(this.hslToHex(hue, 65, 50 + Math.random() * 15));
                }
                break;
            
            default: // random
                for (let i = 0; i < numColors; i++) {
                    colors.push(this.generateRandomColor());
                }
        }

        return colors;
    },

    /**
     * Calculate color distance (for image extraction)
     */
    getColorDistance(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    },

    /**
     * Extract colors from image
     */
    extractColorsFromImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize for performance
                const maxSize = 200;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const colorMap = {};
                
                // Sample pixels and build color map
                for (let i = 0; i < pixels.length; i += 40) { // Sample every 10 pixels
                    const r = Math.round(pixels[i] / 10) * 10;
                    const g = Math.round(pixels[i + 1] / 10) * 10;
                    const b = Math.round(pixels[i + 2] / 10) * 10;
                    const key = `${r},${g},${b}`;
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }
                
                // Get most common colors
                const sortedColors = Object.entries(colorMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(entry => {
                        const [r, g, b] = entry[0].split(',').map(Number);
                        return ColorUtils.rgbToHex(r, g, b);
                    });
                
                // Select diverse colors
                const diverseColors = [];
                for (const color of sortedColors) {
                    if (diverseColors.length === 0 || 
                        diverseColors.every(c => ColorUtils.getColorDistance(c, color) > 50)) {
                        diverseColors.push(color);
                        if (diverseColors.length === 5) break;
                    }
                }
                
                // Fill remaining with next colors
                while (diverseColors.length < 5 && sortedColors.length > diverseColors.length) {
                    diverseColors.push(sortedColors[diverseColors.length]);
                }
                
                // Fill any remaining with random
                while (diverseColors.length < 5) {
                    diverseColors.push(ColorUtils.generateRandomColor());
                }
                
                callback(diverseColors);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    /**
     * Validate hex color
     */
    isValidHex(hex) {
        return /^#?[0-9A-F]{6}$/i.test(hex);
    },

    /**
     * Format hex color
     */
    formatHex(hex) {
        hex = hex.replace('#', '');
        return '#' + hex.toUpperCase();
    }
};

// Make it globally available
window.ColorUtils = ColorUtils;