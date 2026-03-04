document.addEventListener('DOMContentLoaded', function () {

    /* ============================
       PARTICLES BACKGROUND
       ============================ */
    const particlesBg = document.getElementById('particles-bg');
    const colors = ['#FF6B6B', '#4ECDC4', '#A78BFA', '#FBBF24', '#F472B6'];
    
    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 20 + 15;
        const left = Math.random() * 100;
        
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            bottom: -10px;
            animation-duration: ${duration}s;
            animation-delay: ${Math.random() * 10}s;
            box-shadow: 0 0 ${size * 3}px ${color}40;
        `;
        particlesBg.appendChild(p);

        setTimeout(() => {
            p.remove();
        }, (duration + 10) * 1000);
    }

    // Create initial batch
    for (let i = 0; i < 30; i++) {
        setTimeout(createParticle, Math.random() * 5000);
    }

    // Keep creating particles
    setInterval(createParticle, 800);

    /* ============================
       CURSOR GLOW (desktop only)
       ============================ */
    const cursorGlow = document.getElementById('cursor-glow');
    if (window.matchMedia('(pointer: fine)').matches) {
        cursorGlow.style.display = 'block';
        document.addEventListener('mousemove', function (e) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    /* ============================
       SMOOTH SCROLL
       ============================ */
    const linksInternos = document.querySelectorAll('.menu a[href^="#"]');
    linksInternos.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            var sectionDestino = document.querySelector(href);
            if (sectionDestino) {
                sectionDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, href);
            }
        });
    });

    /* ============================
       ACTIVE MENU HIGHLIGHT
       ============================ */
    const sections = document.querySelectorAll('section[id]');
    const menuItems = document.querySelectorAll('.menu a');

    function highlightActiveMenu() {
        var scrollY = window.scrollY;
        var currentSectionId = '';
        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 120;
            var sectionBottom = sectionTop + section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        menuItems.forEach(function (item) {
            item.classList.remove('active');
            var href = item.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveMenu);
    window.addEventListener('load', highlightActiveMenu);

    /* ============================
       REVEAL ON SCROLL
       ============================ */
    var elementosParaRevelar = document.querySelectorAll(
        '.secao, .card, .timeline-item, .card-estatistica, .recurso, .criador-card'
    );

    // Set card index for stagger
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card, index) {
        card.style.setProperty('--card-index', index);
    });

    var criadoresCards = document.querySelectorAll('.criador-card');
    criadoresCards.forEach(function (card, index) {
        card.style.setProperty('--card-index', index);
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Add small delay for staggered effect
                var delay = entry.target.style.getPropertyValue('--card-index');
                if (delay) {
                    setTimeout(function () {
                        entry.target.classList.add('revelado');
                    }, delay * 100);
                } else {
                    entry.target.classList.add('revelado');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05
    });

    elementosParaRevelar.forEach(function (el) {
        el.classList.add('revelar');
        observer.observe(el);
    });

    /* ============================
       COUNTER ANIMATION
       ============================ */
    function animarNumero(elemento, valorFinal, prefixo, sufixo, duracao) {
        prefixo = prefixo || '';
        sufixo = sufixo || '';
        duracao = duracao || 2000;
        var inicio = null;
        
        function step(timestamp) {
            if (!inicio) inicio = timestamp;
            var progresso = Math.min((timestamp - inicio) / duracao, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progresso, 3);
            var valorAtual = Math.round(eased * valorFinal);
            elemento.textContent = prefixo + valorAtual + sufixo;
            if (progresso < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }

    var secaoEstatisticas = document.querySelector('#estatisticas');
    if (secaoEstatisticas) {
        var observerEstatisticas = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var numeros = document.querySelectorAll('.numero[data-valor]');
                    numeros.forEach(function (numero) {
                        var valor = parseInt(numero.getAttribute('data-valor'));
                        var sufixo = numero.getAttribute('data-sufixo') || '';
                        var prefixo = numero.getAttribute('data-prefixo') || '';
                        if (!isNaN(valor) && valor > 0) {
                            numero.textContent = prefixo + '0' + sufixo;
                            animarNumero(numero, valor, prefixo, sufixo, 2500);
                        }
                    });
                    observerEstatisticas.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observerEstatisticas.observe(secaoEstatisticas);
    }

    /* ============================
       TILT EFFECT ON CARDS
       ============================ */
    if (window.matchMedia('(pointer: fine)').matches) {
        var tiltCards = document.querySelectorAll('.criador-card, .card');
        tiltCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = (y - centerY) / 15;
                var rotateY = (centerX - x) / 15;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    /* ============================
       HEADER PARALLAX ON SCROLL
       ============================ */
    var cabecalho = document.querySelector('.cabecalho');
    window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            var opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            cabecalho.style.opacity = Math.max(0, opacity);
        }
    });

    /* ============================
       MAGNETIC BUTTONS (nav)
       ============================ */
    if (window.matchMedia('(pointer: fine)').matches) {
        menuItems.forEach(function (item) {
            item.addEventListener('mousemove', function (e) {
                var rect = item.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });
            item.addEventListener('mouseleave', function () {
                item.style.transform = '';
            });
        });
    }

});
