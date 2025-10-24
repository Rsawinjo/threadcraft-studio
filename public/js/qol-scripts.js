// Quality of Life (QoL) JavaScript - Interactive Features and UX Enhancements

class QoLManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFloatingActionButtons();
        this.setupTooltips();
        this.setupLoadingStates();
        this.setupToastNotifications();
        this.setupKeyboardShortcuts();
        this.setupFormValidation();
        this.setupSmoothScrolling();
        this.setupProgressBars();
        this.setupAccessibilityFeatures();
    }

    // ===== FLOATING ACTION BUTTONS =====
    setupFloatingActionButtons() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        const fabHome = document.getElementById('fabHome');
        const fabTop = document.getElementById('fabTop');

        if (fabMain && fabMenu) {
            fabMain.addEventListener('click', () => {
                fabMenu.classList.toggle('active');
                fabMain.setAttribute('aria-expanded', fabMenu.classList.contains('active'));
            });

            // Close FAB menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
                    fabMenu.classList.remove('active');
                    fabMain.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Home button
        if (fabHome) {
            fabHome.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.showToast('Welcome back to the top!', 'info');
            });
        }

        // Back to top button
        if (fabTop) {
            fabTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.showToast('Scrolled to top!', 'success');
            });
        }
    }

    // ===== TOOLTIPS =====
    setupTooltips() {
        const tooltipContainer = document.getElementById('tooltipContainer');
        const tooltip = document.getElementById('tooltip');

        if (!tooltipContainer || !tooltip) return;

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                const text = target.getAttribute('data-tooltip');
                if (text) {
                    tooltip.textContent = text;
                    tooltip.classList.add('show');

                    const rect = target.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();

                    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    let top = rect.top - tooltipRect.height - 8;

                    // Adjust if tooltip goes off screen
                    if (left < 10) left = 10;
                    if (left + tooltipRect.width > window.innerWidth - 10) {
                        left = window.innerWidth - tooltipRect.width - 10;
                    }
                    if (top < 10) {
                        top = rect.bottom + 8;
                        tooltip.style.transform = 'translateY(8px)';
                    }

                    tooltipContainer.style.left = left + 'px';
                    tooltipContainer.style.top = top + 'px';
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (!e.target.closest('[data-tooltip]')) {
                tooltip.classList.remove('show');
            }
        });
    }

    // ===== LOADING STATES =====
    setupLoadingStates() {
        // Add loading state to buttons with data-loading-text
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-loading-text]');
            if (button && !button.hasAttribute('data-loading')) {
                const originalText = button.innerHTML;
                const loadingText = button.getAttribute('data-loading-text');

                button.setAttribute('data-loading', 'true');
                button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
                button.disabled = true;

                // Simulate loading (remove this in production)
                setTimeout(() => {
                    button.removeAttribute('data-loading');
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }
        });
    }

    // ===== TOAST NOTIFICATIONS =====
    setupToastNotifications() {
        // Toast functionality is available globally
    }

    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        const removeToast = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        };

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', removeToast);

        // Auto close
        if (duration > 0) {
            setTimeout(removeToast, duration);
        }
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===== KEYBOARD SHORTCUTS =====
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Help modal (H key)
            if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.toggleHelpModal();
            }

            // Escape key handling
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    toggleHelpModal() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            const isOpen = modal.classList.contains('show');
            if (isOpen) {
                this.closeModals();
            } else {
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
                // Focus management
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // ===== FORM VALIDATION =====
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showToast('Please fix the errors in the form', 'error');
                } else {
                    e.preventDefault(); // Prevent actual submission for demo
                    this.showFormSuccess(form);
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + '-error');
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation (optional)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (errorElement) {
            if (!isValid) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                field.setAttribute('aria-invalid', 'true');
            } else {
                errorElement.classList.remove('show');
                field.removeAttribute('aria-invalid');
            }
        }

        return isValid;
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.classList.remove('show');
            field.removeAttribute('aria-invalid');
        }
    }

    showFormSuccess(form) {
        const statusElement = form.querySelector('.status-message');
        if (statusElement) {
            statusElement.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            statusElement.classList.add('success');
            statusElement.classList.remove('error');
            statusElement.style.display = 'block';
        }

        this.showToast('Message sent successfully!', 'success');
        form.reset();
    }

    // ===== SMOOTH SCROLLING =====
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // ===== PROGRESS BARS =====
    setupProgressBars() {
        const progressBars = document.querySelectorAll('[role="progressbar"]');
        progressBars.forEach(bar => {
            const value = bar.getAttribute('aria-valuenow') || 0;
            const max = bar.getAttribute('aria-valuemax') || 100;
            const percentage = (value / max) * 100;

            const progressBar = bar.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = percentage + '%';
            }
        });
    }

    updateProgress(selector, value, max = 100) {
        const bar = document.querySelector(selector);
        if (bar) {
            const percentage = (value / max) * 100;
            bar.setAttribute('aria-valuenow', value);

            const progressBar = bar.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = percentage + '%';
            }
        }
    }

    // ===== ACCESSIBILITY FEATURES =====
    setupAccessibilityFeatures() {
        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip links
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('focus', () => {
                link.style.top = '6px';
            });
            link.addEventListener('blur', () => {
                link.style.top = '-40px';
            });
        });
    }

    // ===== UTILITY METHODS =====

    // Show loading overlay
    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');

        if (overlay) {
            if (loadingText) loadingText.textContent = text;
            overlay.classList.add('show');
        }
    }

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    // Debounce utility for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== CUSTOMIZER SPECIFIC FUNCTIONALITY =====

class CustomizerManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.designData = {
            product: 'tshirt',
            color: '#FFFFFF',
            size: 'M',
            design: null,
            designFile: null,
            posX: 50,
            posY: 50,
            scale: 100,
            rotation: 0,
            opacity: 100
        };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupStepNavigation();
        this.setupColorPicker();
        this.setupSizeSelector();
        this.setupTextEditor();
        this.setupDesignUpload();
        this.setupPositioningControls();
        this.setupPreview();
        this.setupCartButton();
        this.updateProgress();
    }

    setupStepNavigation() {
        const steps = document.querySelectorAll('.customizer-step');
        const nextButtons = document.querySelectorAll('.step-next');
        const prevButtons = document.querySelectorAll('.step-prev');
        const progressSteps = document.querySelectorAll('.progress-step');

        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => this.prevStep());
        });

        // Click progress steps to jump to them
        progressSteps.forEach(step => {
            step.addEventListener('click', () => {
                const stepNum = parseInt(step.dataset.step);
                if (stepNum <= this.totalSteps) {
                    this.currentStep = stepNum;
                    this.showStep(this.currentStep);
                    this.updateProgress();
                }
            });
        });
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.scrollToCustomizer();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.scrollToCustomizer();
        }
    }

    showStep(stepNumber) {
        const steps = document.querySelectorAll('.customizer-step');
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        // Update step indicators
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    setupColorPicker() {
        const colorOptions = document.querySelectorAll('.color-option');
        const customProductColor = document.getElementById('customProductColor');

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.designData.color = option.dataset.color;
                this.updateProductPreview();
            });
        });

        if (customProductColor) {
            customProductColor.addEventListener('input', (e) => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.designData.color = e.target.value;
                this.updateProductPreview();
            });
        }
    }

    setupSizeSelector() {
        const sizeOptions = document.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.designData.size = option.dataset.size;
                this.updateProductPreview();
            });
        });
    }

    setupTextEditor() {
        const textInput = document.getElementById('designText');
        const fontSelect = document.getElementById('fontSelect');

        if (textInput) {
            textInput.addEventListener('input', (e) => {
                this.designData.text = e.target.value;
                this.updateDesignPreview();
            });
        }

        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                this.designData.font = e.target.value;
                this.updateDesignPreview();
            });
        }
    }

    setupDesignUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const designUpload = document.getElementById('designUpload');
        const printArea = document.getElementById('printArea');

        if (!uploadArea || !designUpload) return;

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) {
                this.handleFileUpload(files[0]);
            }
        });

        // Click to upload
        uploadArea.addEventListener('click', () => {
            designUpload.click();
        });

        designUpload.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Make print area draggable if design exists
        if (printArea && this.designData.design) {
            this.makePrintAreaDraggable(printArea);
        }
    }

    handleFileUpload(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];

        if (!allowedTypes.includes(file.type)) {
            qolManager.showToast('Invalid file type. Please upload PNG, JPG, GIF, or SVG.', 'error');
            return;
        }

        if (file.size > maxSize) {
            qolManager.showToast('File too large. Maximum size is 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.designData.design = e.target.result;
            this.designData.designFile = file.name;
            this.updateDesignPreview();
            this.updateFileInfo(file.name, file.type);
            
            // Set design image in canvas designer
            if (window.canvasDesigner) {
                window.canvasDesigner.setDesignImage(e.target.result);
            }
            
            // Show positioning controls
            const positioningControls = document.getElementById('positioningControls');
            if (positioningControls) {
                positioningControls.style.display = 'block';
            }
            
            qolManager.showToast('Design uploaded successfully! Drag to position, resize using corners.', 'success');
            
            // Auto-advance to next step
            setTimeout(() => this.nextStep(), 500);
        };
        reader.readAsDataURL(file);
    }

    updateFileInfo(fileName, fileType) {
        const fileNameEl = document.getElementById('designFileName');
        const fileFormatEl = document.getElementById('designFormat');
        if (fileNameEl) fileNameEl.textContent = fileName;
        if (fileFormatEl) fileFormatEl.textContent = fileType.split('/')[1].toUpperCase();
    }

    setupPositioningControls() {
        const posXInput = document.getElementById('posX');
        const posYInput = document.getElementById('posY');
        const sizeInput = document.getElementById('designSize');
        const rotationInput = document.getElementById('rotation');
        const opacityInput = document.getElementById('opacity');

        const posXValue = document.getElementById('posXValue');
        const posYValue = document.getElementById('posYValue');
        const sizeValue = document.getElementById('sizeValue');
        const rotationValue = document.getElementById('rotationValue');
        const opacityValue = document.getElementById('opacityValue');

        if (posXInput) {
            posXInput.addEventListener('input', (e) => {
                this.designData.posX = e.target.value;
                if (posXValue) posXValue.textContent = e.target.value + '%';
                this.updateDesignPreview();
            });
        }

        if (posYInput) {
            posYInput.addEventListener('input', (e) => {
                this.designData.posY = e.target.value;
                if (posYValue) posYValue.textContent = e.target.value + '%';
                this.updateDesignPreview();
            });
        }

        if (sizeInput) {
            sizeInput.addEventListener('input', (e) => {
                this.designData.scale = e.target.value;
                if (sizeValue) sizeValue.textContent = e.target.value + '%';
                this.updateDesignPreview();
            });
        }

        if (rotationInput) {
            rotationInput.addEventListener('input', (e) => {
                this.designData.rotation = e.target.value;
                if (rotationValue) rotationValue.textContent = e.target.value + '°';
                this.updateDesignPreview();
            });
        }

        if (opacityInput) {
            opacityInput.addEventListener('input', (e) => {
                this.designData.opacity = e.target.value;
                if (opacityValue) opacityValue.textContent = e.target.value + '%';
                this.updateDesignPreview();
            });
        }
    }

    makePrintAreaDraggable(element) {
        if (!element) return;

        element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;

            this.dragStart = { x: e.clientX, y: e.clientY };
            // Update position based on drag
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    updateProductPreview() {
        const productDisplay = document.getElementById('productDisplay');
        if (productDisplay) {
            productDisplay.style.backgroundColor = this.designData.color;
        }
    }

    updateDesignPreview() {
        const designImage = document.getElementById('designImage');
        const previewPlaceholder = document.getElementById('previewPlaceholder');
        const designInfo = document.getElementById('designInfo');

        if (!designImage) return;

        if (this.designData.design) {
            designImage.src = this.designData.design;
            designImage.style.display = 'block';
            designImage.style.transform = `
                translate(${this.designData.posX - 50}%, ${this.designData.posY - 50}%) 
                scale(${this.designData.scale / 100}) 
                rotate(${this.designData.rotation}deg)
            `;
            designImage.style.opacity = this.designData.opacity / 100;

            if (previewPlaceholder) previewPlaceholder.style.display = 'none';
            if (designInfo) designInfo.style.display = 'block';
        } else {
            designImage.style.display = 'none';
            if (previewPlaceholder) previewPlaceholder.style.display = 'flex';
        }
    }

    setupPreview() {
        // Set up product preview
        this.updateProductPreview();
        this.updateDesignPreview();
    }

    setupCartButton() {
        const addToCartBtn = document.querySelector('[data-action="submit"]');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }
    }

    addToCart() {
        if (!this.designData.design) {
            qolManager.showToast('Please upload a design first', 'warning');
            return;
        }

        const cartItem = {
            product: this.designData.product,
            color: this.designData.color,
            size: this.designData.size,
            design: this.designData.designFile,
            settings: {
                posX: this.designData.posX,
                posY: this.designData.posY,
                scale: this.designData.scale,
                rotation: this.designData.rotation,
                opacity: this.designData.opacity
            },
            timestamp: new Date().toISOString()
        };

        // Store in localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        qolManager.showToast('Added to cart! ✓', 'success');
        
        // Reset form
        setTimeout(() => {
            this.resetForm();
            window.location.hash = '#checkout';
        }, 1000);
    }

    resetForm() {
        this.currentStep = 1;
        this.designData = {
            product: 'tshirt',
            color: '#FFFFFF',
            size: 'M',
            design: null,
            designFile: null,
            posX: 50,
            posY: 50,
            scale: 100,
            rotation: 0,
            opacity: 100
        };
        this.showStep(1);
        this.updateProgress();
    }

    scrollToCustomizer() {
        const customizer = document.getElementById('customizer');
        if (customizer) {
            customizer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ===== CANVAS DESIGNER - Interactive Drag & Resize =====

class CanvasDesigner {
    constructor(canvasId, printAreaId) {
        this.canvas = document.getElementById(canvasId);
        this.printArea = document.getElementById(printAreaId);
        this.designImage = null;
        this.isSelected = false;
        
        // Design state
        this.design = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotation: 0,
            opacity: 1
        };

        // Interaction state
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.dragStart = { x: 0, y: 0 };
        this.designStart = { x: 0, y: 0, width: 0, height: 0 };

        // Constants
        this.HANDLE_SIZE = 12;
        this.HANDLE_OFFSET = this.HANDLE_SIZE / 2;
        this.MIN_SIZE = 20;

        this.init();
    }

    init() {
        if (!this.canvas || !this.printArea) return;

        this.centerDesign();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        document.addEventListener('touchmove', (e) => this.onTouchMove(e));
        document.addEventListener('touchend', (e) => this.onTouchEnd(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onMouseDown(e) {
        if (!this.designImage) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const handleInfo = this.getResizeHandle(mouseX, mouseY);
        if (handleInfo) {
            this.isResizing = true;
            this.resizeHandle = handleInfo.handle;
            this.dragStart = { x: mouseX, y: mouseY };
            this.designStart = { ...this.design };
            this.canvas.style.cursor = handleInfo.cursor;
            e.preventDefault();
        } else if (this.isPointInDesign(mouseX, mouseY)) {
            this.isDragging = true;
            this.dragStart = { x: mouseX, y: mouseY };
            this.designStart = { ...this.design };
            this.canvas.style.cursor = 'grab';
            e.preventDefault();
        }
    }

    onMouseMove(e) {
        if (!this.designImage) {
            this.canvas.style.cursor = 'default';
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            const deltaX = mouseX - this.dragStart.x;
            const deltaY = mouseY - this.dragStart.y;

            this.design.x = this.designStart.x + deltaX;
            this.design.y = this.designStart.y + deltaY;

            // Constrain to canvas
            this.constrainToCanvas();
            this.render();
        } else if (this.isResizing) {
            this.handleResize(mouseX, mouseY);
            this.render();
        } else {
            // Show cursor hints
            const handleInfo = this.getResizeHandle(mouseX, mouseY);
            if (handleInfo) {
                this.canvas.style.cursor = handleInfo.cursor;
            } else if (this.isPointInDesign(mouseX, mouseY)) {
                this.canvas.style.cursor = 'grab';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    onMouseUp(e) {
        if (this.isDragging || this.isResizing) {
            this.isDragging = false;
            this.isResizing = false;
            this.resizeHandle = null;
            this.canvas.style.cursor = 'default';
            this.updateCustomizerControls();
        }
    }

    onTouchStart(e) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    onTouchMove(e) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        document.dispatchEvent(mouseEvent);
    }

    onTouchEnd(e) {
        const mouseEvent = new MouseEvent('mouseup', {});
        document.dispatchEvent(mouseEvent);
    }

    onKeyDown(e) {
        if (!this.isSelected || !this.designImage) return;

        const step = e.shiftKey ? 10 : 1;

        if (e.key === 'ArrowUp') {
            this.design.y -= step;
            this.constrainToCanvas();
            this.render();
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            this.design.y += step;
            this.constrainToCanvas();
            this.render();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            this.design.x -= step;
            this.constrainToCanvas();
            this.render();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            this.design.x += step;
            this.constrainToCanvas();
            this.render();
            e.preventDefault();
        } else if (e.key === '+' || e.key === '=') {
            this.design.width = Math.min(this.design.width + 5, this.canvas.width);
            this.design.height = Math.min(this.design.height + 5, this.canvas.height);
            this.render();
            e.preventDefault();
        } else if (e.key === '-') {
            this.design.width = Math.max(this.design.width - 5, this.MIN_SIZE);
            this.design.height = Math.max(this.design.height - 5, this.MIN_SIZE);
            this.render();
            e.preventDefault();
        }
    }

    handleResize(mouseX, mouseY) {
        const deltaX = mouseX - this.dragStart.x;
        const deltaY = mouseY - this.dragStart.y;

        switch (this.resizeHandle) {
            case 'nw': // Northwest
                this.design.x += deltaX;
                this.design.y += deltaY;
                this.design.width -= deltaX;
                this.design.height -= deltaY;
                break;
            case 'n': // North
                this.design.y += deltaY;
                this.design.height -= deltaY;
                break;
            case 'ne': // Northeast
                this.design.y += deltaY;
                this.design.width += deltaX;
                this.design.height -= deltaY;
                break;
            case 'w': // West
                this.design.x += deltaX;
                this.design.width -= deltaX;
                break;
            case 'e': // East
                this.design.width += deltaX;
                break;
            case 'sw': // Southwest
                this.design.x += deltaX;
                this.design.width -= deltaX;
                this.design.height += deltaY;
                break;
            case 's': // South
                this.design.height += deltaY;
                break;
            case 'se': // Southeast
                this.design.width += deltaX;
                this.design.height += deltaY;
                break;
        }

        // Enforce minimum size
        if (this.design.width < this.MIN_SIZE) this.design.width = this.MIN_SIZE;
        if (this.design.height < this.MIN_SIZE) this.design.height = this.MIN_SIZE;

        // Constrain to canvas
        this.constrainToCanvas();
    }

    getResizeHandle(x, y) {
        const handles = {
            'nw': { x: this.design.x, y: this.design.y, cursor: 'nwse-resize' },
            'n': { x: this.design.x + this.design.width / 2, y: this.design.y, cursor: 'ns-resize' },
            'ne': { x: this.design.x + this.design.width, y: this.design.y, cursor: 'nesw-resize' },
            'w': { x: this.design.x, y: this.design.y + this.design.height / 2, cursor: 'ew-resize' },
            'e': { x: this.design.x + this.design.width, y: this.design.y + this.design.height / 2, cursor: 'ew-resize' },
            'sw': { x: this.design.x, y: this.design.y + this.design.height, cursor: 'nesw-resize' },
            's': { x: this.design.x + this.design.width / 2, y: this.design.y + this.design.height, cursor: 'ns-resize' },
            'se': { x: this.design.x + this.design.width, y: this.design.y + this.design.height, cursor: 'nwse-resize' }
        };

        for (const [handle, pos] of Object.entries(handles)) {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (distance <= this.HANDLE_SIZE) {
                return { handle, cursor: pos.cursor };
            }
        }
        return null;
    }

    isPointInDesign(x, y) {
        return x >= this.design.x && x <= this.design.x + this.design.width &&
               y >= this.design.y && y <= this.design.y + this.design.height;
    }

    constrainToCanvas() {
        if (this.design.x < 0) this.design.x = 0;
        if (this.design.y < 0) this.design.y = 0;
        if (this.design.x + this.design.width > this.canvas.width) {
            this.design.x = this.canvas.width - this.design.width;
        }
        if (this.design.y + this.design.height > this.canvas.height) {
            this.design.y = this.canvas.height - this.design.height;
        }
    }

    centerDesign() {
        const centerX = (this.canvas.width - this.design.width) / 2;
        const centerY = (this.canvas.height - this.design.height) / 2;
        this.design.x = Math.max(0, centerX);
        this.design.y = Math.max(0, centerY);
    }

    render() {
        const ctx = this.canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid(ctx);

        if (!this.designImage) return;

        // Save context state
        ctx.save();

        // Apply transformations
        ctx.globalAlpha = this.design.opacity;
        ctx.translate(this.design.x + this.design.width / 2, this.design.y + this.design.height / 2);
        ctx.rotate((this.design.rotation * Math.PI) / 180);
        ctx.drawImage(
            this.designImage,
            -this.design.width / 2,
            -this.design.height / 2,
            this.design.width,
            this.design.height
        );

        // Restore context state
        ctx.restore();

        // Draw selection box and handles
        if (this.isSelected) {
            this.drawSelectionBox(ctx);
            this.drawResizeHandles(ctx);
        }
    }

    drawGrid(ctx) {
        const gridSize = 20;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }

    drawSelectionBox(ctx) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(this.design.x, this.design.y, this.design.width, this.design.height);
        ctx.setLineDash([]);
    }

    drawResizeHandles(ctx) {
        const handles = [
            { x: this.design.x, y: this.design.y }, // nw
            { x: this.design.x + this.design.width / 2, y: this.design.y }, // n
            { x: this.design.x + this.design.width, y: this.design.y }, // ne
            { x: this.design.x, y: this.design.y + this.design.height / 2 }, // w
            { x: this.design.x + this.design.width, y: this.design.y + this.design.height / 2 }, // e
            { x: this.design.x, y: this.design.y + this.design.height }, // sw
            { x: this.design.x + this.design.width / 2, y: this.design.y + this.design.height }, // s
            { x: this.design.x + this.design.width, y: this.design.y + this.design.height } // se
        ];

        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#1a1f2e';
        ctx.lineWidth = 2;

        handles.forEach(handle => {
            ctx.fillRect(handle.x - this.HANDLE_OFFSET, handle.y - this.HANDLE_OFFSET, this.HANDLE_SIZE, this.HANDLE_SIZE);
            ctx.strokeRect(handle.x - this.HANDLE_OFFSET, handle.y - this.HANDLE_OFFSET, this.HANDLE_SIZE, this.HANDLE_SIZE);
        });
    }

    setDesignImage(imageUrl) {
        const img = new Image();
        img.onload = () => {
            this.designImage = img;
            const maxWidth = this.canvas.width * 0.6;
            const maxHeight = this.canvas.height * 0.6;
            const ratio = img.width / img.height;

            if (ratio > 1) {
                this.design.width = maxWidth;
                this.design.height = maxWidth / ratio;
            } else {
                this.design.height = maxHeight;
                this.design.width = maxHeight * ratio;
            }

            this.centerDesign();
            this.isSelected = true;
            this.render();
        };
        img.src = imageUrl;
    }

    updateCustomizerControls() {
        if (window.customizerManager) {
            const scaleFactor = this.canvas.width / 300; // Assuming canvas width is 300px
            window.customizerManager.designData.posX = (this.design.x / this.canvas.width) * 100;
            window.customizerManager.designData.posY = (this.design.y / this.canvas.height) * 100;
            window.customizerManager.designData.scale = (this.design.width / (this.canvas.width * 0.6)) * 100;
            window.customizerManager.designData.rotation = this.design.rotation;
            window.customizerManager.designData.opacity = this.design.opacity * 100;
        }
    }

    resetPosition() {
        this.centerDesign();
        this.design.rotation = 0;
        this.design.opacity = 1;
        this.isSelected = true;
        this.render();
        this.updateCustomizerControls();
    }
}

// ===== INITIALIZATION =====

// Initialize QoL features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qolManager = new QoLManager();

    // Initialize customizer if it exists
    if (document.getElementById('customizer')) {
        window.customizerManager = new CustomizerManager();
        
        // Initialize canvas designer for interactive drag-and-resize
        const canvas = document.getElementById('designCanvas');
        const printArea = document.getElementById('printArea');
        if (canvas && printArea) {
            window.canvasDesigner = new CanvasDesigner('designCanvas', 'printArea');
        }
    }

    // Show welcome toast
    setTimeout(() => {
        qolManager.showToast('Welcome to ThreadCraft Studio! Use the floating menu for quick navigation.', 'info', 5000);
    }, 1000);
});

// ===== GLOBAL ERROR HANDLING =====

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    qolManager.showToast('Something went wrong. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    qolManager.showToast('Something went wrong. Please try again.', 'error');
});