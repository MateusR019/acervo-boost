document.addEventListener('DOMContentLoaded', () => {

    // --- TELA DE CARREGAMENTO ---
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });

    // --- PARTICLES.JS CONFIG ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": window.innerWidth < 768 ? 20 : 50, // Menos partículas em mobile
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                },
                "size": {
                    "value": 3,
                    "random": true,
                },
                "line_linked": {
                    "enable": false,
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": false,
                    },
                    "resize": true
                },
                "modes": {
                    "bubble": {
                        "distance": 150,
                        "size": 5,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                }
            },
            "retina_detect": true
        });
    }

    // --- BARRA DE STATUS DINÂMICA ---
    const viewersCount = document.getElementById('viewers-count');
    const salesCount = document.getElementById('sales-count');

    if (viewersCount && salesCount) {
        // Números base fixos para começar
        let currentViewers = 173;
        let currentSales = 27;

        viewersCount.textContent = currentViewers;
        salesCount.textContent = currentSales;

        setInterval(() => {
            // Altera visualizações: adiciona um número aleatório entre 15 e 25
            const viewerIncrease = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
            currentViewers += viewerIncrease;
            viewersCount.textContent = currentViewers;

            // Altera vendas: adiciona ou subtrai um número aleatório entre -2 e 2
            const salesChange = Math.floor(Math.random() * 5) - 2; // Gera de -2 a 2
            currentSales += salesChange;
            if (currentSales < 0) currentSales = 0; // Garante que não fique negativo
            salesCount.textContent = currentSales;

        }, 10000); // Atualiza a cada 10 segundos
    }


    // --- CONTADORES ANIMADOS ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 segundos
            let current = 0;
            const increment = target / (duration / 16);

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (target > 1000000) {
                        counter.textContent = `${(current / 1000000).toFixed(1)}M+`;
                    } else if (target > 1000) {
                        counter.textContent = `${Math.ceil(current / 1000)}K+`;
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                     if (target >= 10000000) {
                        counter.textContent = "10M+";
                    } else if (target >= 50000) {
                        counter.textContent = "50K+";
                    } else if (target >= 99) {
                        counter.textContent = "99%";
                    } else {
                        counter.textContent = target;
                    }
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.getElementById('stats');
    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }

    // --- FAQ TOGGLE ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    // --- ANIMAÇÕES DE SCROLL (SLIDE-IN) ---
    const slideInElements = document.querySelectorAll('#problem li, #transformation li');
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `slideInFrom${entry.target.parentElement.parentElement.id === 'problem' ? 'Left' : 'Right'} 0.5s forwards`;
                slideObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    slideInElements.forEach(el => {
        slideObserver.observe(el);
    });

    // Adicionando keyframes dinamicamente
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        #problem li, #transformation li { opacity: 0; }
    `;
    document.head.appendChild(styleSheet);


    // --- FACEBOOK PIXEL INITIALIZATION & EVENTS ---
    async function initializePixel() {
        try {
            const response = await fetch('/config');
            const config = await response.json();
            const { pixelId, checkoutUrlPremium, checkoutUrlBoost } = config;

            // Atribuir links de checkout aos botões
            document.getElementById('hero-cta-btn').href = checkoutUrlPremium;
            document.getElementById('premium-card-cta-btn').href = checkoutUrlPremium;
            document.getElementById('final-cta-btn').href = checkoutUrlPremium;
            document.getElementById('guarantee-cta-btn').href = checkoutUrlPremium;
            document.getElementById('boost-cta-btn').href = checkoutUrlBoost;

            if (pixelId && pixelId !== 'YOUR_PIXEL_ID') {
                fbq('init', pixelId);
                fbq('track', 'PageView');

                // Anexar eventos de clique após a inicialização bem-sucedida
                attachPixelEvents();
            } else {
                console.warn('Facebook Pixel ID não configurado no servidor.');
            }
        } catch (error) {
            console.error('Erro ao buscar configuração do Pixel:', error);
        }
    }

    function attachPixelEvents() {
        const heroCTA = document.querySelector('.hero-cta');
        const finalCTA = document.querySelector('.final-button');

        if (heroCTA) {
            heroCTA.addEventListener('click', () => {
                fbq('track', 'InitiateCheckout', {
                    value: 9.29,
                    currency: 'BRL',
                    content_name: 'Acervo Premium'
                });
            });
        }

        if (finalCTA) {
            finalCTA.addEventListener('click', () => {
                fbq('track', 'Purchase', {
                    value: 9.29,
                    currency: 'BRL',
                    content_name: 'Acervo Premium'
                });
            });
        }

        // Eventos de saída/retorno (simples)
        let pageLeft = false;
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && !pageLeft) {
                fbq('track', 'PageLeave');
                pageLeft = true;
            } else if (document.visibilityState === 'visible' && pageLeft) {
                fbq('track', 'PageReturn');
            }
        });
    }

    initializePixel();
});