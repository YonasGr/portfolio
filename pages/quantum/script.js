document.addEventListener('DOMContentLoaded', function() {
    // Replaced heavy particle generation and mousemove effects with simple JS for better performance.
    
    // Minimal Input focus/blur effect (lighter than the original)
    const inputs = document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    inputs.forEach(input => {
        const parent = input.closest('.form-section');
        if (parent) {
            input.addEventListener('focus', function() {
                parent.style.transform = 'scale(1.01)';
                parent.style.boxShadow = '0 0 25px rgba(0, 255, 157, 0.4)';
            });
            
            input.addEventListener('blur', function() {
                parent.style.transform = 'scale(1)';
                parent.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.2)';
            });
        }
    });

    // File input label update
    const fileInput = document.getElementById('profile-picture');
    const fileLabel = document.querySelector('.file-upload-label');

    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileLabel.innerHTML = `<i class="fas fa-check-circle"></i> File selected: ${this.files[0].name}`;
                fileLabel.style.borderColor = 'var(--neon-green)';
            } else {
                fileLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Neural Imprint';
                fileLabel.style.borderColor = 'rgba(0, 255, 157, 0.3)';
            }
        });
    }
});