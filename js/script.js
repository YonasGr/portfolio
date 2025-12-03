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

    const BACKEND_URL = 'https://portfolio-web-backend-siq7.onrender.com';

    // Handle file input display
    if (DOMElements.fileInput) {
        DOMElements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                DOMElements.fileName.textContent = `Selected: ${file.name} (${fileSize} MB)`;
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

        setTimeout(() => {
            DOMElements.formMessage.textContent = '';
            DOMElements.formMessage.className = 'form-message';
        }, 5000); // Message disappears after 5 seconds
    }

    // Handle form submission
    if (DOMElements.contactForm) {
        DOMElements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = DOMElements.contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Create FormData from form
            const formData = new FormData(DOMElements.contactForm);

            try {
                const response = await fetch(`${BACKEND_URL}/send-file`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showMessage(result.message || 'Sent successfully! I will get back to you soon.', 'success');
                    DOMElements.contactForm.reset();
                    DOMElements.fileName.textContent = '';
                } else {
                    showMessage(result.message || 'Failed to send. Please try again.', 'error');
                    console.error('Backend error:', result);
                }
            } catch (error) {
                showMessage('An error occurred. Please check your connection and try again.', 'error');
                console.error('Error sending message:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
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
