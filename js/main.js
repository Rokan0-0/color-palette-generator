// ========================================
// MAIN APPLICATION
// ========================================

// Global notification function
function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    if (!notif) return;

    notif.textContent = message;
    notif.className = 'notification show';

    if (type === 'error') {
        notif.style.background = 'var(--danger)';
    } else if (type === 'warning') {
        notif.style.background = 'var(--warning)';
    } else {
        notif.style.background = 'var(--success)';
    }

    setTimeout(() => {
        notif.classList.remove('show');
    }, 2000);
}

// Load saved palettes
function loadSavedPalettes() {
    const saved = Storage.getSavedPalettes();
    const container = document.getElementById('savedPalettes');
    const countEl = document.getElementById('savedCount');

    if (!container) return;

    if (countEl) countEl.textContent = saved.length;

    container.innerHTML = saved.length === 0 ?
        '<p class="text-muted">No saved palettes yet</p>' : '';

    saved.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'saved-palette';
        div.onclick = () => Palette.load(item.colors);

        item.colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'saved-palette-color';
            colorDiv.style.backgroundColor = color;
            div.appendChild(colorDiv);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-palette';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            Storage.deletePalette(index);
            loadSavedPalettes();
            showNotification('Palette deleted');
        };
        div.appendChild(deleteBtn);

        container.appendChild(div);
    });
}

// Theme management
function initTheme() {
    const theme = Storage.getTheme();
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        const toggle = document.getElementById('themeToggle');
        if (toggle) toggle.textContent = '☀️';
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = isLight ? '☀️' : '🌙';
    Storage.saveTheme(isLight ? 'light' : 'dark');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Color Palette Generator Pro - Initializing...');

    // Initialize theme
    initTheme();

    // Initialize palette
    if (typeof Palette !== 'undefined') {
        Palette.init();
        Palette.loadFromUrl();
    }

    // Initialize export manager
    if (typeof ExportManager !== 'undefined') {
        ExportManager.init();
    }

    // Load saved palettes
    loadSavedPalettes();

    // ===========================================
    // EVENT LISTENERS - Main Controls
    // ===========================================

    // Generate button
    document.getElementById('generateBtn')?.addEventListener('click', () => {
        const mode = document.getElementById('harmonyMode')?.value || 'random';
        Palette.generate(mode);
    });

    // Save button
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        Palette.save();
    });

    // Share button
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        Palette.share();
    });

    // More/Settings button (toggle sidebar)
    document.getElementById('moreBtn')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
    });

    // Close sidebar
    document.getElementById('closeSidebar')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.remove('open');
    });

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Clear all palettes
    document.getElementById('clearAllBtn')?.addEventListener('click', () => {
        if (confirm('Delete all saved palettes? This cannot be undone.')) {
            Storage.clearAllPalettes();
            loadSavedPalettes();
            showNotification('All palettes cleared');
        }
    });

    // ===========================================
    // EVENT LISTENERS - Share Modal
    // ===========================================

    // Copy share URL
    document.getElementById('copyShareBtn')?.addEventListener('click', () => {
        const input = document.getElementById('shareUrlInput');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value).then(() => {
                showNotification('Share URL copied!');
            }).catch(err => {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy URL', 'error');
            });
        }
    });

    // Close share modal
    document.getElementById('closeShareModal')?.addEventListener('click', () => {
        document.getElementById('shareModal')?.classList.remove('show');
    });

    // ===========================================
    // EVENT LISTENERS - Image Upload
    // ===========================================

    document.getElementById('imageUpload')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file', 'error');
                return;
            }

            ColorUtils.extractColorsFromImage(file, (colors) => {
                Palette.load(colors);
                showNotification('Colors extracted from image!');
            });
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    });

    // ===========================================
    // EVENT LISTENERS - Color Blindness Filters
    // ===========================================

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            if (filter) {
                Palette.applyFilter(filter);
            }
        });
    });

    // ===========================================
    // EVENT LISTENERS - Modal Overlays
    // ===========================================

    document.querySelectorAll('.modal').forEach(modal => {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
    });

    // ===========================================
    // KEYBOARD SHORTCUTS
    // ===========================================

    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'SELECT' || 
            e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Check if any modal is open
        const modalOpen = document.querySelector('.modal.show');
        if (modalOpen) return;

        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                document.getElementById('generateBtn')?.click();
                break;
            
            case 's':
                e.preventDefault();
                document.getElementById('saveBtn')?.click();
                break;
            
            case 'e':
                e.preventDefault();
                document.getElementById('moreBtn')?.click();
                break;
            
            case 'z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    Palette.undo();
                }
                break;
            
            case 't':
                e.preventDefault();
                toggleTheme();
                break;

            case 'escape':
                // Close any open modals or sidebar
                document.querySelectorAll('.modal.show').forEach(m => {
                    m.classList.remove('show');
                });
                document.getElementById('sidebar')?.classList.remove('show');
                break;
        }
    });

    // ===========================================
    // HARMONY MODE CHANGE
    // ===========================================

    document.getElementById('harmonyMode')?.addEventListener('change', (e) => {
        // Optionally auto-generate on mode change
        const autoGenerate = Storage.getSetting('autoGenerateOnModeChange', false);
        if (autoGenerate) {
            Palette.generate(e.target.value);
        }
    });

    // ===========================================
    // INITIALIZATION COMPLETE
    // ===========================================

    console.log('✅ Application initialized successfully!');
});

// ===========================================
// WINDOW ERROR HANDLER
// ===========================================

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Check console for details.', 'error');
});

// ===========================================
// WINDOW UNLOAD HANDLER
// ===========================================

window.addEventListener('beforeunload', (e) => {
    // Save current palette to history before leaving
    const hasUnsavedChanges = Storage.getSetting('warnOnExit', false);
    if (hasUnsavedChanges && Palette.history.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Check browser compatibility
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof(Storage) !== 'undefined',
        canvas: !!document.createElement('canvas').getContext,
        dragDrop: 'draggable' in document.createElement('div'),
        fileReader: typeof FileReader !== 'undefined'
    };

    const unsupported = Object.entries(features)
        .filter(([name, supported]) => !supported)
        .map(([name]) => name);

    if (unsupported.length > 0) {
        console.warn('Unsupported features:', unsupported);
        showNotification('Some features may not work in your browser', 'warning');
    }

    return unsupported.length === 0;
}

// Run compatibility check
checkBrowserCompatibility();

console.log('🎨 Color Palette Generator Pro v2.0.0');
console.log('📝 GitHub: https://github.com/yourusername/color-palette-generator-pro');