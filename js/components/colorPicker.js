// ========================================
// COLOR PICKER COMPONENT
// ========================================

const ColorPicker = {
    currentIndex: -1,
    isUpdating: false,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // HSL Sliders
        document.getElementById('hueSlider')?.addEventListener('input', () => this.updateFromHSL());
        document.getElementById('satSlider')?.addEventListener('input', () => this.updateFromHSL());
        document.getElementById('lightSlider')?.addEventListener('input', () => this.updateFromHSL());

        // HSL Number Inputs
        document.getElementById('hueInput')?.addEventListener('input', (e) => {
            document.getElementById('hueSlider').value = e.target.value;
            this.updateFromHSL();
        });
        document.getElementById('satInput')?.addEventListener('input', (e) => {
            document.getElementById('satSlider').value = e.target.value;
            this.updateFromHSL();
        });
        document.getElementById('lightInput')?.addEventListener('input', (e) => {
            document.getElementById('lightSlider').value = e.target.value;
            this.updateFromHSL();
        });

        // RGB Sliders
        document.getElementById('redSlider')?.addEventListener('input', () => this.updateFromRGB());
        document.getElementById('greenSlider')?.addEventListener('input', () => this.updateFromRGB());
        document.getElementById('blueSlider')?.addEventListener('input', () => this.updateFromRGB());

        // RGB Number Inputs
        document.getElementById('redInput')?.addEventListener('input', (e) => {
            document.getElementById('redSlider').value = e.target.value;
            this.updateFromRGB();
        });
        document.getElementById('greenInput')?.addEventListener('input', (e) => {
            document.getElementById('greenSlider').value = e.target.value;
            this.updateFromRGB();
        });
        document.getElementById('blueInput')?.addEventListener('input', (e) => {
            document.getElementById('blueSlider').value = e.target.value;
            this.updateFromRGB();
        });

        // Hex Input
        document.getElementById('hexInput')?.addEventListener('input', () => this.updateFromHex());

        // Apply and Cancel buttons
        document.getElementById('applyColorBtn')?.addEventListener('click', () => this.apply());
        document.getElementById('cancelColorBtn')?.addEventListener('click', () => this.close());
        document.getElementById('closeColorPicker')?.addEventListener('click', () => this.close());
    },

    open(index, color) {
        this.currentIndex = index;
        this.setColor(color);
        document.getElementById('colorPickerModal')?.classList.add('show');
    },

    close() {
        document.getElementById('colorPickerModal')?.classList.remove('show');
    },

    setColor(hex) {
        this.isUpdating = true;

        const rgb = ColorUtils.hexToRgb(hex);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Update HSL
        this.setHSL(hsl.h, hsl.s, hsl.l);

        // Update RGB
        this.setRGB(rgb.r, rgb.g, rgb.b);

        // Update Hex
        document.getElementById('hexInput').value = hex.toUpperCase();

        // Update preview
        document.getElementById('pickerPreview').style.backgroundColor = hex;

        this.isUpdating = false;
    },

    setHSL(h, s, l) {
        // Sliders
        document.getElementById('hueSlider').value = h;
        document.getElementById('satSlider').value = s;
        document.getElementById('lightSlider').value = l;

        // Number inputs
        document.getElementById('hueInput').value = h;
        document.getElementById('satInput').value = s;
        document.getElementById('lightInput').value = l;

        // Labels
        document.getElementById('hueValue').textContent = h + '°';
        document.getElementById('satValue').textContent = s + '%';
        document.getElementById('lightValue').textContent = l + '%';
    },

    setRGB(r, g, b) {
        // Sliders
        document.getElementById('redSlider').value = r;
        document.getElementById('greenSlider').value = g;
        document.getElementById('blueSlider').value = b;

        // Number inputs
        document.getElementById('redInput').value = r;
        document.getElementById('greenInput').value = g;
        document.getElementById('blueInput').value = b;

        // Labels
        document.getElementById('redValue').textContent = r;
        document.getElementById('greenValue').textContent = g;
        document.getElementById('blueValue').textContent = b;
    },

    updateFromHSL() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        const h = parseInt(document.getElementById('hueSlider').value);
        const s = parseInt(document.getElementById('satSlider').value);
        const l = parseInt(document.getElementById('lightSlider').value);

        // Update labels
        document.getElementById('hueValue').textContent = h + '°';
        document.getElementById('satValue').textContent = s + '%';
        document.getElementById('lightValue').textContent = l + '%';

        // Update number inputs
        document.getElementById('hueInput').value = h;
        document.getElementById('satInput').value = s;
        document.getElementById('lightInput').value = l;

        // Convert to RGB
        const rgb = ColorUtils.hslToRgb(h, s, l);
        this.setRGB(rgb.r, rgb.g, rgb.b);

        // Convert to Hex
        const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b);
        document.getElementById('hexInput').value = hex.toUpperCase();

        // Update preview
        document.getElementById('pickerPreview').style.backgroundColor = hex;

        this.isUpdating = false;
    },

    updateFromRGB() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        const r = parseInt(document.getElementById('redSlider').value);
        const g = parseInt(document.getElementById('greenSlider').value);
        const b = parseInt(document.getElementById('blueSlider').value);

        // Update labels
        document.getElementById('redValue').textContent = r;
        document.getElementById('greenValue').textContent = g;
        document.getElementById('blueValue').textContent = b;

        // Update number inputs
        document.getElementById('redInput').value = r;
        document.getElementById('greenInput').value = g;
        document.getElementById('blueInput').value = b;

        // Convert to HSL
        const hsl = ColorUtils.rgbToHsl(r, g, b);
        this.setHSL(hsl.h, hsl.s, hsl.l);

        // Convert to Hex
        const hex = ColorUtils.rgbToHex(r, g, b);
        document.getElementById('hexInput').value = hex.toUpperCase();

        // Update preview
        document.getElementById('pickerPreview').style.backgroundColor = hex;

        this.isUpdating = false;
    },

    updateFromHex() {
        if (this.isUpdating) return;

        let hex = document.getElementById('hexInput').value;
        
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Validate
        if (!/^[0-9A-F]{6}$/i.test(hex)) {
            return; // Invalid hex, don't update
        }

        hex = '#' + hex;
        this.isUpdating = true;

        // Convert to RGB
        const rgb = ColorUtils.hexToRgb(hex);
        this.setRGB(rgb.r, rgb.g, rgb.b);

        // Convert to HSL
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.setHSL(hsl.h, hsl.s, hsl.l);

        // Update preview
        document.getElementById('pickerPreview').style.backgroundColor = hex;

        this.isUpdating = false;
    },

    getCurrentColor() {
        return document.getElementById('hexInput').value;
    },

    apply() {
        const color = this.getCurrentColor();
        
        // Trigger custom event
        const event = new CustomEvent('colorApplied', {
            detail: {
                index: this.currentIndex,
                color: color
            }
        });
        document.dispatchEvent(event);

        this.close();
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ColorPicker.init());
} else {
    ColorPicker.init();
}

// Make it globally available
window.ColorPicker = ColorPicker;