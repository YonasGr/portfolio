document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────
       DOM REFERENCES
    ──────────────────────────────────────────── */
    const $ = id => document.getElementById(id);

    const DOM = {
        contactForm:          $('contactForm'),
        formMessage:          $('formMessage'),
        nameInput:            $('name'),
        emailInput:           $('email'),
        explanationInput:     $('explanation'),
        fileInput:            $('file'),
        fileLabel:            $('fileLabel'),
        fileName:             $('fileName'),
        uploadProgressWrapper: $('uploadProgressWrapper'),
        uploadProgressBar:    $('uploadProgressBar'),
        submitBtn:            $('submitBtn'),

        // PDF Modal
        cvModal:       $('cvModal'),
        cvIframe:      $('cvIframe'),
        openCvBtn:     $('openCvBtn'),
        openCvBtn2:    $('openCvBtn2'),
        modalClose:    $('modalClose'),
        modalCloseBtn: $('modalCloseBtn')
    };

    /* ────────────────────────────────────────────
       BACKEND URL
    ──────────────────────────────────────────── */
    const BACKEND_URL = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    )
        ? 'http://localhost:3000'
        : 'https://portfolio-web-backend-siq7.onrender.com';

    const MAX_FILE_SIZE_MB    = 20;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const CV_PDF_PATH         = 'personal/cv/Digital_Cv_Content.pdf';

    /* ────────────────────────────────────────────
       PDF MODAL
    ──────────────────────────────────────────── */
    function openCvModal() {
        if (!DOM.cvModal || !DOM.cvIframe) return;
        // Lazy-load PDF only on first open
        if (!DOM.cvIframe.src || DOM.cvIframe.src === window.location.href) {
            DOM.cvIframe.src = CV_PDF_PATH;
        }
        DOM.cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCvModal() {
        if (!DOM.cvModal) return;
        DOM.cvModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (DOM.openCvBtn)     DOM.openCvBtn.addEventListener('click', openCvModal);
    if (DOM.openCvBtn2)    DOM.openCvBtn2.addEventListener('click', openCvModal);
    if (DOM.modalClose)    DOM.modalClose.addEventListener('click', closeCvModal);
    if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener('click', closeCvModal);

    // Close on overlay click
    if (DOM.cvModal) {
        DOM.cvModal.addEventListener('click', e => {
            if (e.target === DOM.cvModal) closeCvModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCvModal();
    });

    /* ────────────────────────────────────────────
       FILE INPUT — display + validation + drag-drop
    ──────────────────────────────────────────── */
    function showFileName(file) {
        if (!file || !DOM.fileName) return;
        const size = (file.size / (1024 * 1024)).toFixed(2);
        DOM.fileName.textContent = `📎 ${file.name} (${size} MB)`;
        DOM.fileName.classList.add('visible');
    }

    function clearFileName() {
        if (!DOM.fileName) return;
        DOM.fileName.textContent = '';
        DOM.fileName.classList.remove('visible');
    }

    if (DOM.fileInput) {
        DOM.fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) { clearFileName(); return; }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                showMessage(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`, 'error');
                e.target.value = '';
                clearFileName();
                return;
            }
            showFileName(file);
        });
    }

    // Drag-and-drop support
    if (DOM.fileLabel && DOM.fileInput) {
        ['dragenter', 'dragover'].forEach(event => {
            DOM.fileLabel.addEventListener(event, e => {
                e.preventDefault();
                DOM.fileLabel.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(event => {
            DOM.fileLabel.addEventListener(event, e => {
                e.preventDefault();
                DOM.fileLabel.classList.remove('drag-over');
            });
        });

        DOM.fileLabel.addEventListener('drop', e => {
            const file = e.dataTransfer.files[0];
            if (!file) return;

            if (file.size > MAX_FILE_SIZE_BYTES) {
                showMessage(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`, 'error');
                return;
            }

            // Inject dropped file into the real input via DataTransfer
            const dt = new DataTransfer();
            dt.items.add(file);
            DOM.fileInput.files = dt.files;
            showFileName(file);
        });
    }

    /* ────────────────────────────────────────────
       UPLOAD PROGRESS (simulated for fetch)
    ──────────────────────────────────────────── */
    function setProgress(pct) {
        if (!DOM.uploadProgressBar || !DOM.uploadProgressWrapper) return;
        DOM.uploadProgressWrapper.classList.toggle('visible', pct > 0 && pct < 100);
        DOM.uploadProgressBar.style.width = `${pct}%`;
    }

    /* ────────────────────────────────────────────
       MESSAGE DISPLAY
    ──────────────────────────────────────────── */
    let _msgTimeout = null;

    function showMessage(text, type = 'error') {
        if (!DOM.formMessage) return;
        clearTimeout(_msgTimeout);
        DOM.formMessage.textContent = text;
        DOM.formMessage.className   = `form-message ${type}`;

        _msgTimeout = setTimeout(() => {
            DOM.formMessage.style.opacity = '0';
            setTimeout(() => {
                DOM.formMessage.textContent = '';
                DOM.formMessage.className   = 'form-message';
                DOM.formMessage.style.opacity = '1';
            }, 300);
        }, 6000);
    }

    /* ────────────────────────────────────────────
       FETCH WITH RETRY (exponential back-off)
    ──────────────────────────────────────────── */
    async function fetchWithRetry(url, options, maxRetries = 2, baseDelay = 2000) {
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeout    = setTimeout(() => controller.abort(), 45000); // 45 s
                const response   = await fetch(url, { ...options, signal: controller.signal });
                clearTimeout(timeout);
                return response;
            } catch (err) {
                lastError = err;
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    const reason = err.name === 'AbortError' ? 'Server timeout' : 'Connection issue';
                    showMessage(`${reason} — retrying (${attempt + 1}/${maxRetries})…`, 'warning');
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        throw lastError;
    }

    /* ────────────────────────────────────────────
       FORM SUBMISSION
    ──────────────────────────────────────────── */
    if (DOM.contactForm) {
        DOM.contactForm.addEventListener('submit', async e => {
            e.preventDefault();

            const btn = DOM.submitBtn;
            const originalHTML = btn ? btn.innerHTML : '';

            // Loading state
            if (btn) {
                btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
                btn.disabled   = true;
            }
            setProgress(10);

            const formData = new FormData(DOM.contactForm);

            try {
                setProgress(30);
                const response = await fetchWithRetry(`${BACKEND_URL}/send-file`, {
                    method: 'POST',
                    body:   formData
                });
                setProgress(80);

                const result = await response.json();
                setProgress(100);

                if (response.ok && result.success) {
                    showMessage(result.message || 'Message sent successfully! 🎉', 'success');
                    DOM.contactForm.reset();
                    clearFileName();
                } else {
                    throw new Error(result.message || 'Failed to send. Please try again.');
                }
            } catch (err) {
                let msg = 'An error occurred. Please try again.';
                if (err.name === 'AbortError') {
                    msg = 'Request timed out. The server may be waking up — please try again in a moment.';
                } else if (err.message) {
                    msg = err.message;
                }
                showMessage(msg, 'error');
                console.error('Submission error:', err);
            } finally {
                setProgress(0);
                if (btn) {
                    btn.innerHTML = originalHTML;
                    btn.disabled  = false;
                }
            }
        });
    }

    /* ────────────────────────────────────────────
       SCROLL ANIMATIONS
    ──────────────────────────────────────────── */
    const sections = document.querySelectorAll('.standard-section');
    sections.forEach(s => {
        s.style.opacity   = '0';
        s.style.transform = 'translateY(28px)';
    });

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ────────────────────────────────────────────
       SKILL BAR ANIMATIONS
    ──────────────────────────────────────────── */
    document.querySelectorAll('.progress').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width   = '0%';

        const barObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.transition = 'width 1.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    bar.style.width      = targetWidth;
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        barObserver.observe(bar);
    });

    /* ────────────────────────────────────────────
       ACTIVE NAV LINK (scroll spy)
    ──────────────────────────────────────────── */
    const navLinks = document.querySelectorAll('.nav-links a');
    const allSections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.35 });

    allSections.forEach(s => navObserver.observe(s));
});
