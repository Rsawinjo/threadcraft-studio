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
            
            // Show positioning controls
            const positioningControls = document.getElementById('positioningControls');
            if (positioningControls) {
                positioningControls.style.display = 'block';
            }
            
            qolManager.showToast('Design uploaded successfully!', 'success');
            
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

// ===== INITIALIZATION =====

// Initialize QoL features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qolManager = new QoLManager();

    // Initialize customizer if it exists
    if (document.getElementById('customizer')) {
        window.customizerManager = new CustomizerManager();
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