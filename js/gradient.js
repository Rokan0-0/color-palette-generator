// ========================================
// GRADIENT PAGE
// ========================================

const GradientGenerator = {
    type: 'linear',
    angle: 90,
    position: 'center',
    stops: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
    ],
    editingStopIndex: -1,

    init() {
        console.log('🌈 Initializing Gradient Generator...');
        this.loadStopsFromPalette();
        this.bindEvents();
        this.loadPresets();
        this.render();
        console.log('✅ Gradient Generator initialized!');
    },

    loadStopsFromPalette() {
        const params = new URLSearchParams(window.location.search);
        const paletteStr = params.get('palette');
        
        if (paletteStr) {
            const colors = paletteStr.split('-').map(c => '#' + c);
            if (colors.length > 0) {
                this.stops = colors.map((color, i) => ({
                    color: color,
                    position: (i / (colors.length - 1)) * 100
                }));
                console.log('Loaded palette from URL:', colors);
            }
        }
    },

    bindEvents() {
        // Gradient type change
        const typeSelect = document.getElementById('gradientType');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.type = e.target.value;
                this.updateControls();
                this.render();
            });
        }

        // Angle slider
        const angleSlider = document.getElementById('angleSlider');
        if (angleSlider) {
            angleSlider.addEventListener('input', (e) => {
                this.angle = parseInt(e.target.value);
                const angleValue = document.getElementById('angleValue');
                if (angleValue) angleValue.textContent = this.angle + '°';
                this.render();
            });
        }

        // Position select
        const posSelect = document.getElementById('positionSelect');
        if (posSelect) {
            posSelect.addEventListener('change', (e) => {
                this.position = e.target.value;
                this.render();
            });
        }

        // Random gradient button
        const randomBtn = document.getElementById('randomGradientBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.generateRandom();
            });
        }

        // Add color button
        const addBtn = document.getElementById('addColorBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addColorStop();
            });
        }

        // Save gradient button
        const saveBtn = document.getElementById('saveGradientBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.save();
            });
        }

        // Export gradient button
        const exportBtn = document.getElementById('exportGradientBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCSS();
            });
        }

        // Copy CSS button
        const copyBtn = document.getElementById('copyCssBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const css = document.getElementById('cssOutput')?.textContent;
                if (css) {
                    navigator.clipboard.writeText(css).then(() => {
                        showNotification('CSS copied!');
                    }).catch(err => {
                        console.error('Copy failed:', err);
                    });
                }
            });
        }

        // Theme toggle
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }

        // Show saved gradients button
        const showSavedBtn = document.getElementById('showSavedBtn');
        if (showSavedBtn) {
            showSavedBtn.addEventListener('click', () => {
                document.getElementById('gradientSidebar')?.classList.toggle('open');
            });
        }

        // Close sidebar
        const closeSidebarBtn = document.getElementById('closeSidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => {
                document.getElementById('gradientSidebar')?.classList.remove('open');
            });
        }

        // Stop color picker events
        const stopHexInput = document.getElementById('stopHexInput');
        if (stopHexInput) {
            stopHexInput.addEventListener('input', () => {
                this.updateStopPreview();
            });
        }

        const stopPosSlider = document.getElementById('stopPositionSlider');
        if (stopPosSlider) {
            stopPosSlider.addEventListener('input', (e) => {
                const pos = parseInt(e.target.value);
                const posValue = document.getElementById('stopPositionValue');
                if (posValue) posValue.textContent = pos + '%';
            });
        }

        const applyStopBtn = document.getElementById('applyStopBtn');
        if (applyStopBtn) {
            applyStopBtn.addEventListener('click', () => {
                this.applyStopEdit();
            });
        }

        const deleteStopBtn = document.getElementById('deleteStopBtn');
        if (deleteStopBtn) {
            deleteStopBtn.addEventListener('click', () => {
                this.deleteCurrentStop();
            });
        }

        const closeStopBtn = document.getElementById('closeStopPicker');
        if (closeStopBtn) {
            closeStopBtn.addEventListener('click', () => {
                this.closeStopPicker();
            });
        }

        // Clear gradients button
        const clearBtn = document.getElementById('clearGradientsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Delete all saved gradients?')) {
                    Storage.clearAllGradients();
                    this.loadSavedGradients();
                    showNotification('All gradients cleared');
                }
            });
        }

        // Modal overlay
        const modalOverlay = document.querySelector('#stopColorPicker .modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeStopPicker();
            });
        }
    },

    updateControls() {
        const angleCtrl = document.getElementById('angleControl');
        const posCtrl = document.getElementById('positionControl');

        if (this.type === 'linear') {
            angleCtrl?.classList.remove('hidden');
            posCtrl?.classList.add('hidden');
        } else if (this.type === 'radial') {
            angleCtrl?.classList.add('hidden');
            posCtrl?.classList.remove('hidden');
        } else {
            angleCtrl?.classList.add('hidden');
            posCtrl?.classList.add('hidden');
        }
    },

    render() {
        this.renderPreview();
        this.renderStops();
        this.updateCSS();
    },

    renderPreview() {
        const preview = document.getElementById('gradientPreview');
        if (!preview) return;

        preview.style.background = this.getGradientCSS();
    },

    renderStops() {
        const container = document.getElementById('colorStops');
        if (!container) return;

        container.innerHTML = '';

        this.stops.forEach((stop, index) => {
            const stopEl = document.createElement('div');
            stopEl.className = 'color-stop';
            stopEl.onclick = () => this.editStop(index);

            stopEl.innerHTML = `
                <div class="color-stop-preview" style="background: ${stop.color}"></div>
                <div class="color-stop-info">
                    <div class="color-stop-color">${stop.color.toUpperCase()}</div>
                    <div class="color-stop-position">${Math.round(stop.position)}%</div>
                </div>
                <button class="color-stop-delete" onclick="event.stopPropagation()">✕</button>
            `;

            const deleteBtn = stopEl.querySelector('.color-stop-delete');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteStop(index);
            };

            container.appendChild(stopEl);
        });
    },

    getGradientCSS() {
        const sortedStops = [...this.stops].sort((a, b) => a.position - b.position);
        const stopStr = sortedStops.map(s => `${s.color} ${Math.round(s.position)}%`).join(', ');

        switch(this.type) {
            case 'linear':
                return `linear-gradient(${this.angle}deg, ${stopStr})`;
            case 'radial':
                return `radial-gradient(circle at ${this.position}, ${stopStr})`;
            case 'conic':
                return `conic-gradient(from ${this.angle}deg, ${stopStr})`;
            default:
                return `linear-gradient(${this.angle}deg, ${stopStr})`;
        }
    },

    updateCSS() {
        const output = document.getElementById('cssOutput');
        if (!output) return;

        output.textContent = `background: ${this.getGradientCSS()};`;
    },

    addColorStop() {
        const newColor = ColorUtils.generateRandomColor();
        const newPosition = 50;
        
        this.stops.push({ color: newColor, position: newPosition });
        this.render();
        showNotification('Color stop added');
    },

    editStop(index) {
        this.editingStopIndex = index;
        const stop = this.stops[index];
        
        document.getElementById('stopHexInput').value = stop.color;
        document.getElementById('stopPositionSlider').value = Math.round(stop.position);
        document.getElementById('stopPositionValue').textContent = Math.round(stop.position) + '%';
        document.getElementById('stopPreview').style.backgroundColor = stop.color;
        
        document.getElementById('stopColorPicker')?.classList.add('show');
    },

    updateStopPreview() {
        const hex = document.getElementById('stopHexInput').value;
        if (ColorUtils.isValidHex(hex)) {
            document.getElementById('stopPreview').style.backgroundColor = hex;
        }
    },

    applyStopEdit() {
        if (this.editingStopIndex >= 0) {
            const hex = document.getElementById('stopHexInput').value;
            const position = parseInt(document.getElementById('stopPositionSlider').value);

            if (!ColorUtils.isValidHex(hex)) {
                showNotification('Invalid hex color', 'error');
                return;
            }

            this.stops[this.editingStopIndex] = {
                color: ColorUtils.formatHex(hex),
                position: position
            };

            this.render();
            this.closeStopPicker();
            showNotification('Color stop updated');
        }
    },

    deleteStop(index) {
        if (this.stops.length <= 2) {
            showNotification('Minimum 2 colors required', 'warning');
            return;
        }
        this.stops.splice(index, 1);
        this.render();
        showNotification('Color stop deleted');
    },

    deleteCurrentStop() {
        if (this.editingStopIndex >= 0) {
            this.deleteStop(this.editingStopIndex);
            this.closeStopPicker();
        }
    },

    closeStopPicker() {
        document.getElementById('stopColorPicker')?.classList.remove('show');
        this.editingStopIndex = -1;
    },

    generateRandom() {
        const numStops = 2 + Math.floor(Math.random() * 4); // 2-5 stops
        this.stops = [];
        
        for (let i = 0; i < numStops; i++) {
            this.stops.push({
                color: ColorUtils.generateRandomColor(),
                position: (i / (numStops - 1)) * 100
            });
        }
        
        this.angle = Math.floor(Math.random() * 360);
        document.getElementById('angleSlider').value = this.angle;
        document.getElementById('angleValue').textContent = this.angle + '°';
        
        // Random type
        const types = ['linear', 'radial', 'conic'];
        this.type = types[Math.floor(Math.random() * types.length)];
        document.getElementById('gradientType').value = this.type;
        
        this.updateControls();
        this.render();
        showNotification('Random gradient generated!');
    },

    save() {
        Storage.saveGradient({
            type: this.type,
            angle: this.angle,
            position: this.position,
            stops: this.stops
        });
        this.loadSavedGradients();
        showNotification('Gradient saved!');
    },

    loadSavedGradients() {
        const saved = Storage.getSavedGradients();
        const container = document.getElementById('savedGradients');
        
        if (!container) return;

        container.innerHTML = saved.length === 0 ?
            '<p class="text-muted">No saved gradients yet</p>' : '';

        saved.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'saved-gradient';
            
            // Create gradient from saved data
            const tempGen = {
                type: item.gradient.type,
                angle: item.gradient.angle,
                position: item.gradient.position,
                stops: item.gradient.stops
            };
            
            const sortedStops = [...tempGen.stops].sort((a, b) => a.position - b.position);
            const stopStr = sortedStops.map(s => `${s.color} ${Math.round(s.position)}%`).join(', ');
            
            let gradient;
            switch(tempGen.type) {
                case 'linear':
                    gradient = `linear-gradient(${tempGen.angle}deg, ${stopStr})`;
                    break;
                case 'radial':
                    gradient = `radial-gradient(circle at ${tempGen.position}, ${stopStr})`;
                    break;
                case 'conic':
                    gradient = `conic-gradient(from ${tempGen.angle}deg, ${stopStr})`;
                    break;
            }
            
            div.style.background = gradient;
            div.onclick = () => this.loadGradient(item.gradient);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-palette';
            deleteBtn.textContent = '✕';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                Storage.deleteGradient(index);
                this.loadSavedGradients();
                showNotification('Gradient deleted');
            };
            div.appendChild(deleteBtn);

            container.appendChild(div);
        });
    },

    loadGradient(gradient) {
        this.type = gradient.type;
        this.angle = gradient.angle;
        this.position = gradient.position;
        this.stops = gradient.stops;

        document.getElementById('gradientType').value = this.type;
        document.getElementById('angleSlider').value = this.angle;
        document.getElementById('angleValue').textContent = this.angle + '°';
        document.getElementById('positionSelect').value = this.position;

        this.updateControls();
        this.render();
        showNotification('Gradient loaded!');
    },

    loadPresets() {
        const presets = [
            {
                name: 'Sunset',
                type: 'linear',
                angle: 135,
                stops: [
                    { color: '#fa709a', position: 0 },
                    { color: '#fee140', position: 100 }
                ]
            },
            {
                name: 'Ocean',
                type: 'linear',
                angle: 180,
                stops: [
                    { color: '#2E3192', position: 0 },
                    { color: '#1BFFFF', position: 100 }
                ]
            },
            {
                name: 'Purple Dream',
                type: 'linear',
                angle: 90,
                stops: [
                    { color: '#c471f5', position: 0 },
                    { color: '#fa71cd', position: 100 }
                ]
            },
            {
                name: 'Forest',
                type: 'linear',
                angle: 45,
                stops: [
                    { color: '#134E5E', position: 0 },
                    { color: '#71B280', position: 100 }
                ]
            },
            {
                name: 'Fire',
                type: 'radial',
                position: 'center',
                angle: 0,
                stops: [
                    { color: '#f12711', position: 0 },
                    { color: '#f5af19', position: 100 }
                ]
            },
            {
                name: 'Cool Sky',
                type: 'linear',
                angle: 0,
                stops: [
                    { color: '#2193b0', position: 0 },
                    { color: '#6dd5ed', position: 100 }
                ]
            },
            {
                name: 'Peach',
                type: 'linear',
                angle: 90,
                stops: [
                    { color: '#ED4264', position: 0 },
                    { color: '#FFEDBC', position: 100 }
                ]
            },
            {
                name: 'Mint',
                type: 'linear',
                angle: 45,
                stops: [
                    { color: '#00b09b', position: 0 },
                    { color: '#96c93d', position: 100 }
                ]
            }
        ];

        const container = document.getElementById('gradientPresets');
        if (!container) return;

        presets.forEach(preset => {
            const div = document.createElement('div');
            div.className = 'gradient-preset';
            div.title = preset.name;

            const stopStr = preset.stops.map(s => `${s.color} ${Math.round(s.position)}%`).join(', ');
            let gradient;

            if (preset.type === 'linear') {
                gradient = `linear-gradient(${preset.angle}deg, ${stopStr})`;
            } else if (preset.type === 'radial') {
                gradient = `radial-gradient(circle at ${preset.position}, ${stopStr})`;
            } else if (preset.type === 'conic') {
                gradient = `conic-gradient(from ${preset.angle}deg, ${stopStr})`;
            }

            div.style.background = gradient;
            div.onclick = () => {
                this.type = preset.type;
                this.angle = preset.angle || 90;
                this.position = preset.position || 'center';
                this.stops = [...preset.stops];

                document.getElementById('gradientType').value = this.type;
                document.getElementById('angleSlider').value = this.angle;
                document.getElementById('angleValue').textContent = this.angle + '°';
                
                this.updateControls();
                this.render();
                showNotification(`${preset.name} preset loaded!`);
            };

            container.appendChild(div);
        });
    },

    exportCSS() {
        const css = `/* Gradient CSS */\nbackground: ${this.getGradientCSS()};`;
        const blob = new Blob([css], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradient-${Date.now()}.css`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Gradient exported!');
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌈 Gradient Page - Starting initialization...');
    
    // Initialize theme
    initTheme();
    
    // Initialize gradient generator
    GradientGenerator.init();
    
    // Load saved gradients
    GradientGenerator.loadSavedGradients();

    console.log('✅ Gradient Page fully loaded!');
});

// Make it globally available
window.GradientGenerator = GradientGenerator;// ========================================
// GRADIENT PAGE
// ========================================

const GradientGenerator = {
    type: 'linear',
    angle: 90,
    position: 'center',
    stops: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
    ],
    editingStopIndex: -1,

    init() {
        this.loadStopsFromPalette();
        this.bindEvents();
        this.loadPresets();
        this.render();
    },

    loadStopsFromPalette() {
        const params = new URLSearchParams(window.location.search);
        const paletteStr = params.get('palette');
        
        if (paletteStr) {
            const colors = paletteStr.split('-').map(c => '#' + c);
            if (colors.length > 0) {
                this.stops = colors.map((color, i) => ({
                    color: color,
                    position: (i / (colors.length - 1)) * 100
                }));
            }
        }
    },

    bindEvents() {
        // Gradient type change
        document.getElementById('gradientType')?.addEventListener('change', (e) => {
            this.type = e.target.value;
            this.updateControls();
            this.render();
        });

        // Angle slider
        document.getElementById('angleSlider')?.addEventListener('input', (e) => {
            this.angle = parseInt(e.target.value);
            document.getElementById('angleValue').textContent = this.angle + '°';
            this.render();
        });

        // Position select
        document.getElementById('positionSelect')?.addEventListener('change', (e) => {
            this.position = e.target.value;
            this.render();
        });

        // Random gradient button
        document.getElementById('randomGradientBtn')?.addEventListener('click', () => {
            this.generateRandom();
        });

        // Add color button
        document.getElementById('addColorBtn')?.addEventListener('click', () => {
            this.addColorStop();
        });

        // Save gradient button
        document.getElementById('saveGradientBtn')?.addEventListener('click', () => {
            this.save();
        });

        // Export gradient button
        document.getElementById('exportGradientBtn')?.addEventListener('click', () => {
            this.exportCSS();
        });

        // Copy CSS button
        document.getElementById('copyCssBtn')?.addEventListener('click', () => {
            const css = document.getElementById('cssOutput')?.textContent;
            if (css) {
                navigator.clipboard.writeText(css);
                showNotification('CSS copied!');
            }
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

        // Stop color picker events
        document.getElementById('stopHexInput')?.addEventListener('input', () => {
            this.updateStopPreview();
        });

        document.getElementById('stopPositionSlider')?.addEventListener('input', (e) => {
            const pos = parseInt(e.target.value);
            document.getElementById('stopPositionValue').textContent = pos + '%';
        });

        document.getElementById('applyStopBtn')?.addEventListener('click', () => {
            this.applyStopEdit();
        });

        document.getElementById('deleteStopBtn')?.addEventListener('click', () => {
            this.deleteCurrentStop();
        });

        document.getElementById('closeStopPicker')?.addEventListener('click', () => {
            this.closeStopPicker();
        });

        // Clear gradients button
        document.getElementById('clearGradientsBtn')?.addEventListener('click', () => {
            if (confirm('Delete all saved gradients?')) {
                Storage.clearAllGradients();
                this.loadSavedGradients();
                showNotification('All gradients cleared');
            }
        });
    },

    updateControls() {
        const angleCtrl = document.getElementById('angleControl');
        const posCtrl = document.getElementById('positionControl');

        if (this.type === 'linear') {
            angleCtrl?.classList.remove('hidden');
            posCtrl?.classList.add('hidden');
        } else if (this.type === 'radial') {
            angleCtrl?.classList.add('hidden');
            posCtrl?.classList.remove('hidden');
        } else {
            angleCtrl?.classList.add('hidden');
            posCtrl?.classList.add('hidden');
        }
    },

    render() {
        this.renderPreview();
        this.renderStops();
        this.updateCSS();
    },

    renderPreview() {
        const preview = document.getElementById('gradientPreview');
        if (!preview) return;

        preview.style.background = this.getGradientCSS();
    },

    renderStops() {
        const container = document.getElementById('colorStops');
        if (!container) return;

        container.innerHTML = '';

        this.stops.forEach((stop, index) => {
            const stopEl = document.createElement('div');
            stopEl.className = 'color-stop';
            stopEl.onclick = () => this.editStop(index);

            stopEl.innerHTML = `
                <div class="color-stop-preview" style="background: ${stop.color}"></div>
                <div class="color-stop-info">
                    <div class="color-stop-color">${stop.color.toUpperCase()}</div>
                    <div class="color-stop-position">${stop.position}%</div>
                </div>
                <button class="color-stop-delete">✕</button>
            `;

            stopEl.querySelector('.color-stop-delete').onclick = (e) => {
                e.stopPropagation();
                this.deleteStop(index);
            };

            container.appendChild(stopEl);
        });
    },

    getGradientCSS() {
        const sortedStops = [...this.stops].sort((a, b) => a.position - b.position);
        const stopStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

        switch(this.type) {
            case 'linear':
                return `linear-gradient(${this.angle}deg, ${stopStr})`;
            case 'radial':
                return `radial-gradient(circle at ${this.position}, ${stopStr})`;
            case 'conic':
                return `conic-gradient(from ${this.angle}deg, ${stopStr})`;
            default:
                return `linear-gradient(${this.angle}deg, ${stopStr})`;
        }
    },

    updateCSS() {
        const output = document.getElementById('cssOutput');
        if (!output) return;

        output.textContent = `background: ${this.getGradientCSS()};`;
    },

    addColorStop() {
        const newColor = ColorUtils.generateRandomColor();
        const newPosition = 50;
        
        this.stops.push({ color: newColor, position: newPosition });
        this.render();
        showNotification('Color stop added');
    },

    editStop(index) {
        this.editingStopIndex = index;
        const stop = this.stops[index];
        
        document.getElementById('stopHexInput').value = stop.color;
        document.getElementById('stopPositionSlider').value = stop.position;
        document.getElementById('stopPositionValue').textContent = stop.position + '%';
        document.getElementById('stopPreview').style.backgroundColor = stop.color;
        
        document.getElementById('stopColorPicker')?.classList.add('show');
    },

    updateStopPreview() {
        const hex = document.getElementById('stopHexInput').value;
        if (ColorUtils.isValidHex(hex)) {
            document.getElementById('stopPreview').style.backgroundColor = hex;
        }
    },

    applyStopEdit() {
        if (this.editingStopIndex >= 0) {
            const hex = document.getElementById('stopHexInput').value;
            const position = parseInt(document.getElementById('stopPositionSlider').value);

            if (!ColorUtils.isValidHex(hex)) {
                showNotification('Invalid hex color', 'error');
                return;
            }

            this.stops[this.editingStopIndex] = {
                color: ColorUtils.formatHex(hex),
                position: position
            };

            this.render();
            this.closeStopPicker();
            showNotification('Color stop updated');
        }
    },

    deleteStop(index) {
        if (this.stops.length <= 2) {
            showNotification('Minimum 2 colors required', 'warning');
            return;
        }
        this.stops.splice(index, 1);
        this.render();
        showNotification('Color stop deleted');
    },

    deleteCurrentStop() {
        if (this.editingStopIndex >= 0) {
            this.deleteStop(this.editingStopIndex);
            this.closeStopPicker();
        }
    },

    closeStopPicker() {
        document.getElementById('stopColorPicker')?.classList.remove('show');
        this.editingStopIndex = -1;
    },

    generateRandom() {
        const numStops = 2 + Math.floor(Math.random() * 4); // 2-5 stops
        this.stops = [];
        
        for (let i = 0; i < numStops; i++) {
            this.stops.push({
                color: ColorUtils.generateRandomColor(),
                position: (i / (numStops - 1)) * 100
            });
        }
        
        this.angle = Math.floor(Math.random() * 360);
        document.getElementById('angleSlider').value = this.angle;
        document.getElementById('angleValue').textContent = this.angle + '°';
        
        // Random type
        const types = ['linear', 'radial', 'conic'];
        this.type = types[Math.floor(Math.random() * types.length)];
        document.getElementById('gradientType').value = this.type;
        
        this.updateControls();
        this.render();
        showNotification('Random gradient generated!');
    },

    save() {
        Storage.saveGradient({
            type: this.type,
            angle: this.angle,
            position: this.position,
            stops: this.stops
        });
        this.loadSavedGradients();
        showNotification('Gradient saved!');
    },

    loadSavedGradients() {
        const saved = Storage.getSavedGradients();
        const container = document.getElementById('savedGradients');
        
        if (!container) return;

        container.innerHTML = saved.length === 0 ?
            '<p class="text-muted">No saved gradients yet</p>' : '';

        saved.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'saved-gradient';
            
            // Create gradient from saved data
            const tempGen = {
                type: item.gradient.type,
                angle: item.gradient.angle,
                position: item.gradient.position,
                stops: item.gradient.stops
            };
            
            const sortedStops = [...tempGen.stops].sort((a, b) => a.position - b.position);
            const stopStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
            
            let gradient;
            switch(tempGen.type) {
                case 'linear':
                    gradient = `linear-gradient(${tempGen.angle}deg, ${stopStr})`;
                    break;
                case 'radial':
                    gradient = `radial-gradient(circle at ${tempGen.position}, ${stopStr})`;
                    break;
                case 'conic':
                    gradient = `conic-gradient(from ${tempGen.angle}deg, ${stopStr})`;
                    break;
            }
            
            div.style.background = gradient;
            div.onclick = () => this.loadGradient(item.gradient);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-palette';
            deleteBtn.textContent = '✕';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                Storage.deleteGradient(index);
                this.loadSavedGradients();
                showNotification('Gradient deleted');
            };
            div.appendChild(deleteBtn);

            container.appendChild(div);
        });
    },

    loadGradient(gradient) {
        this.type = gradient.type;
        this.angle = gradient.angle;
        this.position = gradient.position;
        this.stops = gradient.stops;

        document.getElementById('gradientType').value = this.type;
        document.getElementById('angleSlider').value = this.angle;
        document.getElementById('angleValue').textContent = this.angle + '°';
        document.getElementById('positionSelect').value = this.position;

        this.updateControls();
        this.render();
        showNotification('Gradient loaded!');
    },

    loadPresets() {
        const presets = [
            {
                name: 'Sunset',
                type: 'linear',
                angle: 135,
                stops: [
                    { color: '#fa709a', position: 0 },
                    { color: '#fee140', position: 100 }
                ]
            },
            {
                name: 'Ocean',
                type: 'linear',
                angle: 180,
                stops: [
                    { color: '#2E3192', position: 0 },
                    { color: '#1BFFFF', position: 100 }
                ]
            },
            {
                name: 'Purple Dream',
                type: 'linear',
                angle: 90,
                stops: [
                    { color: '#c471f5', position: 0 },
                    { color: '#fa71cd', position: 100 }
                ]
            },
            {
                name: 'Forest',
                type: 'linear',
                angle: 45,
                stops: [
                    { color: '#134E5E', position: 0 },
                    { color: '#71B280', position: 100 }
                ]
            },
            {
                name: 'Fire',
                type: 'radial',
                position: 'center',
                stops: [
                    { color: '#f12711', position: 0 },
                    { color: '#f5af19', position: 100 }
                ]
            },
            {
                name: 'Cool Sky',
                type: 'linear',
                angle: 0,
                stops: [
                    { color: '#2193b0', position: 0 },
                    { color: '#6dd5ed', position: 100 }
                ]
            }
        ];

        const container = document.getElementById('gradientPresets');
        if (!container) return;

        presets.forEach(preset => {
            const div = document.createElement('div');
            div.className = 'gradient-preset';
            div.title = preset.name;

            const stopStr = preset.stops.map(s => `${s.color} ${s.position}%`).join(', ');
            let gradient;

            if (preset.type === 'linear') {
                gradient = `linear-gradient(${preset.angle}deg, ${stopStr})`;
            } else if (preset.type === 'radial') {
                gradient = `radial-gradient(circle at ${preset.position}, ${stopStr})`;
            }

            div.style.background = gradient;
            div.onclick = () => {
                this.type = preset.type;
                this.angle = preset.angle || 90;
                this.position = preset.position || 'center';
                this.stops = [...preset.stops];

                document.getElementById('gradientType').value = this.type;
                document.getElementById('angleSlider').value = this.angle;
                document.getElementById('angleValue').textContent = this.angle + '°';
                
                this.updateControls();
                this.render();
                showNotification(`${preset.name} preset loaded!`);
            };

            container.appendChild(div);
        });
    },

    exportCSS() {
        const css = `/* Gradient CSS */\n${this.getGradientCSS()}`;
        const blob = new Blob([css], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradient-${Date.now()}.css`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Gradient exported!');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌈 Gradient Generator - Initializing...');
    
    initTheme();
    GradientGenerator.init();
    GradientGenerator.loadSavedGradients();

    // Modal overlay click handler
    document.querySelector('#stopColorPicker .modal-overlay')?.addEventListener('click', () => {
        GradientGenerator.closeStopPicker();
    });

    console.log('✅ Gradient Generator initialized!');
});

// Make it globally available
window.GradientGenerator = GradientGenerator;