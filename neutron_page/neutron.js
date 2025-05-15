document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('#navbar ul');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        document.querySelectorAll('#navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // Unified Slider Logic
    const sliders = [
        {
            container: '#second-page .features-slider2',
            slides: '.feature-slide2',
            prevBtn: '#second-page .prev-feature',
            nextBtn: '#second-page .next-feature',
            section: '#second-page'
        },
        {
            container: '#fourth-page .features-slider',
            slides: '.feature-slide',
            prevBtn: '#fourth-page .prev-feature',
            nextBtn: '#fourth-page .next-feature',
            section: '#fourth-page'
        }
    ];

    sliders.forEach(config => {
        const slider = document.querySelector(config.container);
        const slides = document.querySelectorAll(config.slides);
        const prevBtn = document.querySelector(config.prevBtn);
        const nextBtn = document.querySelector(config.nextBtn);
        const section = document.querySelector(config.section);

        if (!slider || !slides.length || !prevBtn || !nextBtn || !section) {
            console.warn('Slider initialization failed:', config);
            return;
        }

        let currentIndex = 0;
        const autoSlideInterval = 10000; // 10 seconds
        const restartDelay = 1000; // 1 second
        let autoSlideTimer = null;
        let isAutoSliding = false;

        // Determine number of slides to show based on viewport
        function getSlidesToShow() {
            const width = window.innerWidth;
            if (width <= 480) return 1;
            if (width <= 768) return 2;
            if (width <= 1024) return 3;
            return 4;
        }

        // Calculate slide width including margins
        function calculateSlideWidth() {
            const slide = slides[0];
            const style = getComputedStyle(slide);
            const width = slide.offsetWidth;
            const marginLeft = parseFloat(style.marginLeft) || 0;
            const marginRight = parseFloat(style.marginRight) || 0;
            return width + marginLeft + marginRight;
        }

        // Update slider position
        function updateSlider() {
            const slidesToShow = getSlidesToShow();
            const slideWidth = calculateSlideWidth();
            const maxIndex = Math.max(0, slides.length - slidesToShow);
            currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }

        // Auto-slide logic
        function autoSlide() {
            const slidesToShow = getSlidesToShow();
            const maxIndex = slides.length - slidesToShow;
            if (currentIndex >= maxIndex) {
                setTimeout(() => {
                    currentIndex = 0;
                    updateSlider();
                    if (isAutoSliding) {
                        autoSlideTimer = setTimeout(autoSlide, autoSlideInterval);
                    }
                }, restartDelay);
            } else {
                currentIndex++;
                updateSlider();
                if (isAutoSliding) {
                    autoSlideTimer = setTimeout(autoSlide, autoSlideInterval);
                }
            }
        }

        // Intersection Observer for auto-slide
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isAutoSliding) {
                            isAutoSliding = true;
                            autoSlideTimer = setTimeout(autoSlide, autoSlideInterval);
                        }
                    } else {
                        isAutoSliding = false;
                        clearTimeout(autoSlideTimer);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(section);

        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            clearTimeout(autoSlideTimer);
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
            if (isAutoSliding) {
                autoSlideTimer = setTimeout(autoSlide, autoSlideInterval);
            }
        });

        nextBtn.addEventListener('click', () => {
            clearTimeout(autoSlideTimer);
            const slidesToShow = getSlidesToShow();
            if (currentIndex < slides.length - slidesToShow) {
                currentIndex++;
                updateSlider();
            } else {
                setTimeout(() => {
                    currentIndex = 0;
                    updateSlider();
                    if (isAutoSliding) {
                        autoSlideTimer = setTimeout(autoSlide, autoSlideInterval);
                    }
                }, restartDelay);
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            updateSlider();
        });

        // Initialize slider
        updateSlider();
    });

    // Video Pause on End
    const video = document.getElementById('electron-video');
    if (video) {
        video.addEventListener('ended', () => {
            video.pause();
            video.currentTime = video.duration;
        });
    }

    // Subscription Popup
    const buyButtons = document.querySelectorAll('.buy-button');
    const popup = document.getElementById('subscription-popup');
    const subscribeButton = document.getElementById('subscribe-button');
    const emailInput = document.getElementById('email-input');

    if (buyButtons.length && popup && subscribeButton && emailInput) {
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                popup.classList.add('active');
            });
        });

        popup.addEventListener('click', e => {
            if (e.target === popup) {
                popup.classList.remove('active');
            }
        });

        subscribeButton.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (email && /\S+@\S+\.\S+/.test(email)) {
                alert(`Thank you for subscribing with ${email}!`);
                emailInput.value = '';
                popup.classList.remove('active');
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
});