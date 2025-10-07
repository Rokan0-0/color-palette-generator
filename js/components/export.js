// ========================================
// EXPORT COMPONENT
// ========================================

const ExportManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('[data-export]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.export;
                this.export(format, Palette.colors);
            });
        });
    },

    export(format, colors) {
        let content = '';
        let filename = `palette-${Date.now()}`;
        let mimeType = 'text/plain';

        switch(format) {
            case 'css':
                content = this.generateCSS(colors);
                filename += '.css';
                break;

            case 'scss':
                content = this.generateSCSS(colors);
                filename += '.scss';
                break;

            case 'json':
                content = this.generateJSON(colors);
                filename += '.json';
                mimeType = 'application/json';
                break;

            case 'svg':
                content = this.generateSVG(colors);
                filename += '.svg';
                mimeType = 'image/svg+xml';
                break;

            case 'tailwind':
                content = this.generateTailwind(colors);
                filename += '.js';
                mimeType = 'application/javascript';
                break;

            case 'ase':
                content = this.generateASE(colors);
                filename += '.ase';
                mimeType = 'application/octet-stream';
                break;

            default:
                console.error('Unknown export format:', format);
                return;
        }

        this.download(content, filename, mimeType);
        showNotification(`Exported as ${format.toUpperCase()}!`);
    },

    generateCSS(colors) {
        let css = '/* Color Palette CSS Variables */\n';
        css += ':root {\n';
        colors.forEach((color, i) => {
            css += `  --color-${i + 1}: ${color};\n`;
        });
        css += '}\n\n';
        css += '/* Usage example:\n';
        css += '   background-color: var(--color-1);\n';
        css += '*/';
        return css;
    },

    generateSCSS(colors) {
        let scss = '// Color Palette SCSS Variables\n\n';
        colors.forEach((color, i) => {
            scss += `$color-${i + 1}: ${color};\n`;
        });
        scss += '\n// Usage example:\n';
        scss += '// background-color: $color-1;\n';
        return scss;
    },

    generateJSON(colors) {
        const data = {
            palette: colors.map((color, i) => {
                const rgb = ColorUtils.hexToRgb(color);
                const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
                return {
                    id: i + 1,
                    name: `color-${i + 1}`,
                    hex: color,
                    rgb: {
                        r: rgb.r,
                        g: rgb.g,
                        b: rgb.b,
                        string: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                    },
                    hsl: {
                        h: hsl.h,
                        s: hsl.s,
                        l: hsl.l,
                        string: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
                    }
                };
            }),
            metadata: {
                generated: new Date().toISOString(),
                count: colors.length,
                version: '2.0.0'
            }
        };
        return JSON.stringify(data, null, 2);
    },

    generateSVG(colors) {
        const width = colors.length * 100;
        const height = 100;
        
        let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        svg += `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
        svg += `  <title>Color Palette</title>\n`;
        
        colors.forEach((color, i) => {
            svg += `  <rect x="${i * 100}" y="0" width="100" height="${height}" fill="${color}">\n`;
            svg += `    <title>${color}</title>\n`;
            svg += `  </rect>\n`;
        });
        
        svg += '</svg>';
        return svg;
    },

    generateTailwind(colors) {
        let config = '// Tailwind CSS Color Configuration\n\n';
        config += 'module.exports = {\n';
        config += '  theme: {\n';
        config += '    extend: {\n';
        config += '      colors: {\n';
        config += '        palette: {\n';
        
        colors.forEach((color, i) => {
            config += `          ${i + 1}: '${color}',\n`;
        });
        
        config += '        }\n';
        config += '      }\n';
        config += '    }\n';
        config += '  }\n';
        config += '}\n\n';
        config += '// Usage example:\n';
        config += '// <div className="bg-palette-1">...</div>\n';
        config += '// <div className="text-palette-2">...</div>\n';
        
        return config;
    },

    generateASE(colors) {
        // Adobe Swatch Exchange format (simplified binary format)
        let data = 'ASEF'; // File signature
        data += '\x00\x01\x00\x00'; // Version (1.0)
        
        // Number of blocks
        const blockCount = colors.length;
        data += String.fromCharCode(
            (blockCount >> 24) & 0xFF,
            (blockCount >> 16) & 0xFF,
            (blockCount >> 8) & 0xFF,
            blockCount & 0xFF
        );

        colors.forEach((color, i) => {
            const rgb = ColorUtils.hexToRgb(color);
            const name = `Color ${i + 1}`;

            // Block type (color entry)
            data += '\x00\x01';
            
            // Block length (calculated)
            const nameLength = name.length * 2 + 2; // UTF-16 + null terminator
            const blockLength = nameLength + 4 + 4 + 12 + 2; // name + "RGB " + 3 floats + color mode
            data += String.fromCharCode(
                (blockLength >> 24) & 0xFF,
                (blockLength >> 16) & 0xFF,
                (blockLength >> 8) & 0xFF,
                blockLength & 0xFF
            );
            
            // Name length
            data += String.fromCharCode(0, name.length);
            
            // Name (UTF-16 big-endian)
            for (let char of name) {
                data += '\x00' + char;
            }
            data += '\x00\x00'; // Null terminator
            
            // Color space (RGB)
            data += 'RGB ';
            
            // RGB values (32-bit floats, big-endian)
            data += this.floatToBytes(rgb.r / 255);
            data += this.floatToBytes(rgb.g / 255);
            data += this.floatToBytes(rgb.b / 255);
            
            // Color mode (global = 0)
            data += '\x00\x00';
        });

        return data;
    },

    floatToBytes(float) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, float, false); // big-endian
        return String.fromCharCode(
            view.getUint8(0),
            view.getUint8(1),
            view.getUint8(2),
            view.getUint8(3)
        );
    },

    download(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
};

// Make it globally available
window.ExportManager = ExportManager;