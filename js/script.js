document.addEventListener('DOMContentLoaded', () => {
    // Highlight Active Nav Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a, .navbar-nav .nav-link');
    
    navItems.forEach(link => {
        // Get the href attribute and strip any leading paths if necessary
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact Form Validation
    const contactForm = document.querySelector('.needs-validation');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 发送中...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '✅ 发送成功';
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('btn-success');
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.classList.remove('btn-success');
                        submitBtn.classList.add('btn-primary');
                    }, 3000);
                }, 1500);
            }
            
            contactForm.classList.add('was-validated');
        }, false);
    }

    // Product Card Toggle
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const btn = card.querySelector('.toggle-details-btn');
        const details = card.querySelector('.product-details');
        
        if (btn && details) {
            // The details variable here points to the wrapper now due to HTML structure change?
            // No, querySelector finds the first match. 
            // In my new HTML:
            // <div class="product-details-wrapper">
            //    <div class="product-details">
            
            // So `card.querySelector('.product-details')` will still find the inner div.
            // But I need to target the wrapper for accessibility or just keep it as is?
            // The animation is on the wrapper.
            // The button toggles the `expanded` class on the card.
            // The CSS handles the rest.
            // So the JS logic for toggling class is fine.
            
            // Accessibility:
            // aria-controls should probably point to the visible content container?
            // Or the wrapper?
            // Let's point to the wrapper if we can find it, or just keep it simple.
            // Actually, the user won't see the wrapper structure difference.
            // Let's update the selector if needed.
            // But wait, I didn't change the JS to look for wrapper.
            // The CSS uses `.product-details-wrapper`.
            
            // Let's verify what `details` is.
            // card.querySelector('.product-details') gets the inner div.
            // This ID is used for aria-controls.
            // That's fine. The content is inside.
            
            // Initialize Accessibility Attributes
            const detailsId = `product-details-${index}`;
            details.id = detailsId;
            btn.setAttribute('aria-controls', detailsId);
            btn.setAttribute('aria-expanded', 'false');
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                card.classList.toggle('expanded');
                const isExpanded = card.classList.contains('expanded');
                
                // Update State
                btn.textContent = isExpanded ? '收起详情' : '查看详情';
                btn.setAttribute('aria-expanded', isExpanded);
            });
        }
    });
});
