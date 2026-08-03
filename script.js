document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroVideo = document.getElementById('hero-bg-video');

    let ticking = false;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    function updateHeroParallax() {
        const scrollY = window.scrollY || window.pageYOffset;
        const maxTravel = isTouchDevice ? 42 : 120;
        const progress = Math.min(scrollY / window.innerHeight, 1);
        const offset = Math.min(scrollY * (isTouchDevice ? 0.08 : 0.18), maxTravel);
        const opacity = Math.max(0, 1 - progress * 0.95);

        if (hero) {
            hero.style.setProperty('--hero-progress', progress.toString());
        }

        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${offset}px, 0)`;
            heroContent.style.opacity = opacity.toString();
        }

        if (scrollIndicator) {
            scrollIndicator.style.transform = `translateX(-50%) translateY(${offset * 0.6}px)`;
            scrollIndicator.style.opacity = opacity.toString();
        }

        if (heroVideo && !isTouchDevice) {
            heroVideo.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
        } else if (heroVideo) {
            heroVideo.style.transform = 'translate3d(0, 0, 0)';
        }
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeroParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    updateHeroParallax();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.getElementById('preloader-progress');

    const assetsToLoad = [
        { type: 'video', el: document.getElementById('hero-bg-video') },
        { type: 'video', el: document.getElementById('hero-cv-1') },
        { type: 'video', el: document.getElementById('hero-cv-2') },
        { type: 'image', el: document.getElementById('hero-img') }
    ];

    let loadedCount = 0;
    const totalAssets = assetsToLoad.length;
    let isLoaded = false;

    function finishLoading() {
        if (isLoaded) return;
        isLoaded = true;
        if (preloaderProgress) preloaderProgress.style.width = '100%';
        setTimeout(() => {
            if (preloader) preloader.classList.add('fade-out');
        }, 300);
    }

    function updatePreloaderProgress() {
        loadedCount++;
        const percentage = (loadedCount / totalAssets) * 100;
        if (preloaderProgress) preloaderProgress.style.width = `${percentage}%`;
        if (loadedCount >= totalAssets) {
            finishLoading();
        }
    }

    // Fallback timeout (5 seconds)
    setTimeout(finishLoading, 5000);

    // Track each asset
    assetsToLoad.forEach(asset => {
        if (!asset.el) {
            updatePreloaderProgress();
            return;
        }

        if (asset.type === 'video') {
            if (asset.el.readyState >= 3) { // HAVE_FUTURE_DATA
                updatePreloaderProgress();
            } else {
                asset.el.addEventListener('canplaythrough', updatePreloaderProgress, { once: true });
                asset.el.addEventListener('error', updatePreloaderProgress, { once: true });
            }
        } else if (asset.type === 'image') {
            if (asset.el.complete) {
                updatePreloaderProgress();
            } else {
                asset.el.addEventListener('load', updatePreloaderProgress, { once: true });
                asset.el.addEventListener('error', updatePreloaderProgress, { once: true });
            }
        }
    });

    // --- Booking Modal Logic ---
    const bookingModal = document.getElementById('booking-modal');
    const openModalBtn = document.getElementById('open-booking-modal');
    const closeModalBtn = document.getElementById('close-modal');

    function openModal() {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Close modal when clicking outside content
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // --- Booking Form Logic ---
    const form = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.form-step');
    const progressIndicator = document.getElementById('progress-indicator');
    const progressText = document.getElementById('progress-text');

    let currentStep = 1;
    const totalSteps = steps.length;

    // State object to hold form data
    const formData = {
        placement: '',
        size: '',
        name: ''
    };

    // Update progress UI
    function updateProgress() {
        const percentage = (currentStep / totalSteps) * 100;
        progressIndicator.style.width = `${percentage}%`;
        progressText.textContent = `${currentStep}/${totalSteps}`;
    }

    // Show specific step
    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        updateProgress();
        validateCurrentStep();
    }

    // Next / Prev Button Listeners
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // --- Step 1 & 2: Chip Selection Logic ---
    function setupChips(groupId, dataKey) {
        const group = document.getElementById(groupId);
        const chips = group.querySelectorAll('.chip');
        const nextBtn = group.closest('.form-step').querySelector('.next-btn');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove selected from all
                chips.forEach(c => c.classList.remove('selected'));
                // Add to clicked
                chip.classList.add('selected');

                const val = chip.getAttribute('data-value');
                formData[dataKey] = val;

                // Specific logic for "Other" placement
                if (groupId === 'placement-group') {
                    const otherInput = document.getElementById('placement-other');
                    if (val === 'Other') {
                        otherInput.classList.remove('hidden');
                        otherInput.focus();
                        formData[dataKey] = otherInput.value.trim();
                    } else {
                        otherInput.classList.add('hidden');
                    }
                }

                validateCurrentStep();
            });
        });
    }

    setupChips('placement-group', 'placement');
    setupChips('size-group', 'size');

    // Handle "Other" placement input
    const placementOtherInput = document.getElementById('placement-other');
    placementOtherInput.addEventListener('input', (e) => {
        formData.placement = e.target.value.trim();
        validateCurrentStep();
    });

    // Handle Name Input
    const nameInput = document.getElementById('client-name');
    nameInput.addEventListener('input', (e) => {
        formData.name = e.target.value.trim();
        validateCurrentStep();
    });

    // Handle Checkbox
    const ageVerify = document.getElementById('age-verify');
    ageVerify.addEventListener('change', () => {
        validateCurrentStep();
    });

    // --- Validation Logic ---
    function validateCurrentStep() {
        const currentStepEl = document.getElementById(`step-${currentStep}`);
        const nextBtn = currentStepEl.querySelector('.next-btn');
        const submitBtn = currentStepEl.querySelector('.submit-btn');

        let isValid = false;

        if (currentStep === 1) {
            isValid = formData.placement !== '';
        } else if (currentStep === 2) {
            isValid = formData.size !== '';
        } else if (currentStep === 3) {
            isValid = formData.name !== '';
        } else if (currentStep === 4) {
            isValid = ageVerify.checked;
        }

        if (nextBtn) nextBtn.disabled = !isValid;
        if (submitBtn) submitBtn.disabled = !isValid;
    }

    // --- Form Submit ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Final verification
        if (!ageVerify.checked) return;

        // Construct WhatsApp URL
        const phone = '972525486738';
        const rawMessage = `Hi! I'm interested in a tattoo.\nPlacement: ${formData.placement}\nSize: ${formData.size}\nName: ${formData.name}`;
        const encodedMessage = encodeURIComponent(rawMessage);
        const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

        // Close modal before redirect
        closeModal();

        // Redirect
        window.location.href = waUrl;
    });

    // --- Gallery & Lightbox Logic ---
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeContent = document.querySelector('.marquee-content');
    const galleryImages = Array.from(marqueeContent.querySelectorAll('img'));

    let isDragging = false;
    let isUserInteracting = false;
    let startX = 0;
    let animationId = null;
    let resumeTimeout = null;
    const autoScrollSpeed = 0.9;

    function getLoopWidth() {
        return marqueeContent.scrollWidth / 2;
    }

    function animateMarquee() {
        if (!isUserInteracting) {
            marqueeContainer.scrollLeft += autoScrollSpeed;

            const loopWidth = getLoopWidth();
            if (marqueeContainer.scrollLeft >= loopWidth) {
                marqueeContainer.scrollLeft -= loopWidth;
            }
        }

        animationId = requestAnimationFrame(animateMarquee);
    }

    setTimeout(() => {
        animationId = requestAnimationFrame(animateMarquee);
    }, 100);

    function pauseAutoScroll() {
        isUserInteracting = true;
        clearTimeout(resumeTimeout);
    }

    function resumeAutoScroll() {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 900);
    }

    let hasDragged = false;
    let clickTarget = null;

    marqueeContainer.addEventListener('pointerdown', (e) => {
        pauseAutoScroll();
        isDragging = true;
        startX = e.clientX;
        hasDragged = false;
        clickTarget = e.target;
        e.preventDefault();
        marqueeContainer.setPointerCapture(e.pointerId);
    });

    marqueeContainer.addEventListener('pointermove', (e) => {
        if (!isDragging || !marqueeContainer.hasPointerCapture(e.pointerId)) return;
        e.preventDefault();
        const deltaX = e.clientX - startX;
        startX = e.clientX;
        marqueeContainer.scrollLeft -= deltaX;

        if (Math.abs(deltaX) > 5) {
            hasDragged = true;
        }
    });

    marqueeContainer.addEventListener('pointerup', (e) => {
        if (isDragging) {
            isDragging = false;
            if (marqueeContainer.hasPointerCapture(e.pointerId)) {
                marqueeContainer.releasePointerCapture(e.pointerId);
            }
            resumeAutoScroll();

            if (!hasDragged && clickTarget && clickTarget.tagName.toLowerCase() === 'img') {
                const idx = galleryImages.indexOf(clickTarget);
                if (idx > -1) {
                    openLightbox(idx % uniqueImages.length);
                }
            }
        }
    });

    marqueeContainer.addEventListener('pointercancel', (e) => {
        if (isDragging) {
            isDragging = false;
            if (marqueeContainer.hasPointerCapture(e.pointerId)) {
                marqueeContainer.releasePointerCapture(e.pointerId);
            }
            resumeAutoScroll();
        }
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentLightboxIndex = 0;
    const uniqueImages = galleryImages.slice(0, galleryImages.length / 2);

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = uniqueImages[currentLightboxIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % uniqueImages.length;
        lightboxImg.src = uniqueImages[currentLightboxIndex].src;
    }

    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + uniqueImages.length) % uniqueImages.length;
        lightboxImg.src = uniqueImages[currentLightboxIndex].src;
    }

    galleryImages.forEach((img) => {
        img.ondragstart = () => false; // Prevent native browser drag
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // --- Global WhatsApp CTA Visibility (Hidden on Hero, Visible on all other sections) ---
    const globalCta = document.querySelector('.global-cta');
    const heroSection = document.getElementById('hero');

    if (globalCta && heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When hero section is intersecting, hide CTA button; show on all other sections
                if (entry.isIntersecting) {
                    globalCta.classList.remove('visible');
                    document.body.classList.remove('cta-visible');
                } else {
                    globalCta.classList.add('visible');
                    document.body.classList.add('cta-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        heroObserver.observe(heroSection);
    }

    // --- Cookie Policy Banner Logic ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');

    if (cookieBanner && cookieAcceptBtn) {
        // Show banner if consent hasn't been saved yet
        if (!localStorage.getItem('sage_cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
            }, 600);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            cookieBanner.classList.add('hidden');
            localStorage.setItem('sage_cookie_consent', 'accepted');
        });
    }

    // Initialize
    updateProgress();
});
