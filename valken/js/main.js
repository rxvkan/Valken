(function () {
    'use strict';

    const splashScreen = document.getElementById('splashScreen');
    const splashButton = document.getElementById('splashButton');
    const mainContent = document.getElementById('mainContent');
    const particlesContainer = document.getElementById('particlesContainer');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const bgMusic = document.getElementById('bgMusic');
    const playerCards = document.querySelectorAll('.player-card');

    let splashDismissed = false;

    function createParticles() {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        const count = window.innerWidth < 600 ? 16 : 30;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3.2 + 1.6;
            const posX = Math.random() * 100;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 22;
            const opacityBase = Math.random() * 0.45 + 0.15;

            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = posX + '%';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            particle.style.opacity = opacityBase;
            fragment.appendChild(particle);
        }

        particlesContainer.appendChild(fragment);
    }

    function startBackgroundMusic() {
        if (!bgMusic) return;
        bgMusic.volume = 0.1;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(function () {
                console.log('Background music started');
            }).catch(function () {
                console.warn('Autoplay prevented, music will start on next interaction');
            });
        }
    }

    function revealMainContent() {
        if (splashDismissed) return;
        splashDismissed = true;

        startBackgroundMusic();

        splashScreen.classList.add('fade-out');

        setTimeout(function () {
            splashScreen.style.display = 'none';
            mainContent.classList.add('visible');

            if (playerCards.length) {
                playerCards.forEach(function (card, index) {
                    card.style.transitionDelay = (index * 75) + 'ms';
                    card.classList.add('revealed');
                });
            }
        }, 400);
    }

    function handleScrollTopButton() {
        if (!scrollTopBtn) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function handleLogoError() {
        const splashLogo = document.getElementById('splashLogo');
        const splashFallback = document.getElementById('splashLogoFallback');
        const headerLogo = document.getElementById('headerLogo');
        const headerFallback = document.getElementById('headerLogoFallback');

        function checkLogo(img, fallback) {
            if (!img || !fallback) return;
            if (img.complete && img.naturalWidth === 0) {
                img.classList.add('hidden');
                fallback.classList.remove('hidden');
            }
            img.addEventListener('error', function () {
                img.classList.add('hidden');
                fallback.classList.remove('hidden');
            });
        }

        checkLogo(splashLogo, splashFallback);
        checkLogo(headerLogo, headerFallback);
    }

    function handlePlayerImageFallback() {
        const photos = document.querySelectorAll('.player-photo');
        photos.forEach(function (photo) {
            photo.addEventListener('error', function () {
                photo.style.display = 'none';
                const fallback = photo.nextElementSibling;
                if (fallback && fallback.classList.contains('player-photo-fallback')) {
                    fallback.style.display = 'flex';
                }
            });
            if (photo.complete && photo.naturalWidth === 0) {
                photo.style.display = 'none';
                const fallback = photo.nextElementSibling;
                if (fallback && fallback.classList.contains('player-photo-fallback')) {
                    fallback.style.display = 'flex';
                }
            }
        });
    }

    function init() {
        createParticles();
        handleScrollTopButton();
        handleLogoError();
        handlePlayerImageFallback();

        if (splashButton) {
            splashButton.addEventListener('click', revealMainContent);
        }

        window.addEventListener('resize', function () {
            if (window.resizeTimer) clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(createParticles, 300);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();