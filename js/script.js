document.addEventListener('DOMContentLoaded', () => {
    const DOMElements = {
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage'),
        nameInput: document.getElementById('name'),
        emailInput: document.getElementById('email'),
        explanationInput: document.getElementById('explanation'),
        fileInput: document.getElementById('file'),
        fileName: document.getElementById('fileName')
    };

    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000'
        : 'https://portfolio-web-backend-siq7.onrender.com';

    // Constants
    const MAX_FILE_SIZE_MB = 20;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Handle file input display and validation
    if (DOMElements.fileInput) {
        DOMElements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    showMessage(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`, 'error');
                    e.target.value = ''; // Clear input
                    DOMElements.fileName.textContent = '';
                    return;
                }
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                DOMElements.fileName.textContent = `Selected: ${file.name} (${fileSize} MB)`;
                DOMElements.fileName.style.color = 'var(--accent-green)';
            } else {
                DOMElements.fileName.textContent = '';
            }
        });
    }

    // Function to display messages to the user
    function showMessage(text, type) {
        if (!DOMElements.formMessage) return;
        DOMElements.formMessage.textContent = text;
        DOMElements.formMessage.className = `form-message ${type}`;

        // Clear previous timeout if exists
        if (DOMElements.formMessage.timeoutId) {
            clearTimeout(DOMElements.formMessage.timeoutId);
        }

        DOMElements.formMessage.timeoutId = setTimeout(() => {
            DOMElements.formMessage.style.opacity = '0';
            setTimeout(() => {
                DOMElements.formMessage.textContent = '';
                DOMElements.formMessage.className = 'form-message';
                DOMElements.formMessage.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    // Handle form submission
    if (DOMElements.contactForm) {
        DOMElements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = DOMElements.contactForm.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(DOMElements.contactForm);

            try {
                // Add timeout to fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

                const response = await fetch(`${BACKEND_URL}/send-file`, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const result = await response.json();

                if (response.ok && result.success) {
                    showMessage(result.message || 'Message sent successfully!', 'success');
                    DOMElements.contactForm.reset();
                    DOMElements.fileName.textContent = '';
                } else {
                    throw new Error(result.message || 'Failed to send message.');
                }
            } catch (error) {
                let errorMessage = 'An error occurred. Please try again.';

                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please check your connection.';
                } else if (error.message) {
                    errorMessage = error.message;
                }

                showMessage(errorMessage, 'error');
                console.error('Submission error:', error);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }

    // A simple animation for sections as they come into view
    // Select all standard sections including the new certificates section
    const sections = document.querySelectorAll('.standard-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';

        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = width;
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        barObserver.observe(bar);
    });
});
