// ========================================
// STORAGE UTILITY FUNCTIONS
// ========================================

const Storage = {
    /**
     * Save palette to localStorage
     */
    savePalette(colors) {
        const saved = this.getSavedPalettes();
        saved.unshift({
            colors: colors,
            timestamp: Date.now()
        });
        localStorage.setItem('savedPalettes', JSON.stringify(saved));
    },

    /**
     * Get all saved palettes
     */
    getSavedPalettes() {
        try {
            return JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        } catch (e) {
            console.error('Error loading saved palettes:', e);
            return [];
        }
    },

    /**
     * Delete palette at index
     */
    deletePalette(index) {
        const saved = this.getSavedPalettes();
        saved.splice(index, 1);
        localStorage.setItem('savedPalettes', JSON.stringify(saved));
    },

    /**
     * Clear all saved palettes
     */
    clearAllPalettes() {
        localStorage.removeItem('savedPalettes');
    },

    /**
     * Save gradient
     */
    saveGradient(gradient) {
        const saved = this.getSavedGradients();
        saved.unshift({
            gradient: gradient,
            timestamp: Date.now()
        });
        localStorage.setItem('savedGradients', JSON.stringify(saved));
    },

    /**
     * Get all saved gradients
     */
    getSavedGradients() {
        try {
            return JSON.parse(localStorage.getItem('savedGradients') || '[]');
        } catch (e) {
            console.error('Error loading saved gradients:', e);
            return [];
        }
    },

    /**
     * Delete gradient at index
     */
    deleteGradient(index) {
        const saved = this.getSavedGradients();
        saved.splice(index, 1);
        localStorage.setItem('savedGradients', JSON.stringify(saved));
    },

    /**
     * Clear all saved gradients
     */
    clearAllGradients() {
        localStorage.removeItem('savedGradients');
    },

    /**
     * Save theme preference
     */
    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    },

    /**
     * Get theme preference
     */
    getTheme() {
        return localStorage.getItem('theme') || 'dark';
    },

    /**
     * Save settings
     */
    saveSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        localStorage.setItem('settings', JSON.stringify(settings));
    },

    /**
     * Get all settings
     */
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem('settings') || '{}');
        } catch (e) {
            console.error('Error loading settings:', e);
            return {};
        }
    },

    /**
     * Get single setting
     */
    getSetting(key, defaultValue = null) {
        const settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }
};

// Make it globally available
window.Storage = Storage;