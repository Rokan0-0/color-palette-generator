// ========================================
// PALETTE COMPONENT
// ========================================

const Palette = {
    colors: [],
    lockedColors: [],
    history: [],
    currentFilter: 'none',
    draggedIndex: -1,

    init(initialColors = null) {
        this.colors = initialColors || ColorUtils.generatePalette('random');
        this.lockedColors = new Array(5).fill(false);
        this.render();
        this.bindEvents();
    },

    bindEvents() {
        // Listen for color applied event from ColorPicker
        document.addEventListener('colorApplied', (e) => {
            this.saveToHistory();
            this.colors[e.detail.index] = e.detail.color;
            this.render();
        });
    },

    render() {
        const container = document.getElementById('paletteContainer');
        if (!container) return;

        container.innerHTML = '';

        this.colors.forEach((color, index) => {
            const column = document.createElement('div');
            column.className = 'color-column';
            column.style.backgroundColor = color;
            column.draggable = true;
            column.dataset.index = index;

            const rgb = ColorUtils.hexToRgb(color);
            const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
            const colorName = ColorUtils.getColorName(color);
            const textColor = ColorUtils.getTextColor(color);

            column.innerHTML = `
                <div class="color-actions">
                    <button class="action-btn ${this.lockedColors[index] ? 'locked' : ''}" 
                            data-action="lock" data-index="${index}">
                        ${this.lockedColors[index] ? '🔒' : '🔓'}
                    </button>
                    <button class="action-btn" data-action="edit" data-index="${index}">
                        🎨
                    </button>
                </div>
                <div class="color-main">
                    <div class="color-info" style="color: ${textColor}">
                        <div class="color-name">${colorName}</div>
                        <div class="color-hex">${color.toUpperCase()}</div>
                        <div class="color-formats">
                            RGB(${rgb.r}, ${rgb.g}, ${rgb.b})<br>
                            HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)
                        </div>
                    </div>
                </div>
            `;

            // Click to copy
            column.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.copyColor(color);
                }
            });

            // Action buttons
            column.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const idx = parseInt(btn.dataset.index);

                    if (action === 'lock') {
                        this.toggleLock(idx);
                    } else if (action === 'edit') {
                        ColorPicker.open(idx, this.colors[idx]);
                    }
                });
            });

            // Drag and drop
            column.addEventListener('dragstart', (e) => this.handleDragStart(e));
            column.addEventListener('dragover', (e) => this.handleDragOver(e));
            column.addEventListener('drop', (e) => this.handleDrop(e));
            column.addEventListener('dragend', (e) => this.handleDragEnd(e));

            container.appendChild(column);
        });

        this.updateAccessibility();
    },

    generate(mode) {
        this.saveToHistory();
        const newPalette = ColorUtils.generatePalette(mode);

        this.colors = this.colors.map((color, index) =>
            this.lockedColors[index] ? color : newPalette[index]
        );

        this.render();
    },

    toggleLock(index) {
        this.lockedColors[index] = !this.lockedColors[index];
        this.render();
    },

    copyColor(color) {
        navigator.clipboard.writeText(color).then(() => {
            showNotification(`Copied ${color}`);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    },

    saveToHistory() {
        this.history.push({
            colors: [...this.colors],
            locked: [...this.lockedColors]
        });
        if (this.history.length > 20) {
            this.history.shift();
        }
    },

    undo() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.colors = previous.colors;
            this.lockedColors = previous.locked;
            this.render();
            showNotification('Undo successful');
        }
    },

    save() {
        Storage.savePalette(this.colors);
        loadSavedPalettes();
        showNotification('Palette saved!');
    },

    load(colors) {
        this.saveToHistory();
        this.colors = [...colors];
        this.lockedColors = new Array(5).fill(false);
        this.render();
    },

    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const paletteStr = params.get('palette');
        if (paletteStr) {
            const colors = paletteStr.split('-').map(c => '#' + c);
            if (colors.length === 5 && colors.every(c => ColorUtils.isValidHex(c))) {
                this.load(colors);
                showNotification('Palette loaded from URL!');
            }
        }
    },

    share() {
        const colorStr = this.colors.map(c => c.replace('#', '')).join('-');
        const url = `${window.location.origin}${window.location.pathname}?palette=${colorStr}`;
        document.getElementById('shareUrlInput').value = url;
        document.getElementById('shareModal')?.classList.add('show');
    },

    applyFilter(filterName) {
        this.currentFilter = filterName;
        const container = document.getElementById('paletteContainer');
        container.className = 'palette-container ' + filterName;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterName) {
                btn.classList.add('active');
            }
        });
    },

    updateAccessibility() {
        const container = document.getElementById('accessibilityResults');
        if (!container) return;

        container.innerHTML = '';

        for (let i = 0; i < this.colors.length - 1; i++) {
            const ratio = ColorUtils.getContrastRatio(this.colors[i], this.colors[i + 1]);
            const wcagAA = ratio >= 4.5;
            const wcagAAA = ratio >= 7;

            const check = document.createElement('div');
            check.className = 'accessibility-check';
            check.innerHTML = `
                <div class="contrast-pair">
                    <span>Color ${i + 1} vs ${i + 2}</span>
                    <span class="contrast-ratio ${wcagAAA ? 'pass' : wcagAA ? 'pass' : 'fail'}">
                        ${ratio.toFixed(2)}:1 ${wcagAAA ? 'AAA ✓' : wcagAA ? 'AA ✓' : '✗'}
                    </span>
                </div>
            `;
            container.appendChild(check);
        }
    },

    // Drag and Drop Handlers
    handleDragStart(e) {
        this.draggedIndex = parseInt(e.target.dataset.index);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    },

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
        return false;
    },

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const dropIndex = parseInt(e.currentTarget.dataset.index);

        if (this.draggedIndex !== dropIndex) {
            this.saveToHistory();

            const newColors = [...this.colors];
            const newLocked = [...this.lockedColors];

            const draggedColor = newColors[this.draggedIndex];
            const draggedLock = newLocked[this.draggedIndex];

            newColors.splice(this.draggedIndex, 1);
            newLocked.splice(this.draggedIndex, 1);

            newColors.splice(dropIndex, 0, draggedColor);
            newLocked.splice(dropIndex, 0, draggedLock);

            this.colors = newColors;
            this.lockedColors = newLocked;
            this.render();
        }

        return false;
    },

    handleDragEnd(e) {
        document.querySelectorAll('.color-column').forEach(col => {
            col.classList.remove('dragging', 'drag-over');
        });
    }
};

// Make it globally available
window.Palette = Palette;