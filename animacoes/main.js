document.addEventListener('DOMContentLoaded', function() {
    
    const linksInternos = document.querySelectorAll('.menu a[href^="#"]');
    
    linksInternos.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const href = this.getAttribute('href');
            const sectionDestino = document.querySelector(href);
            
            if (sectionDestino) {
                sectionDestino.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                history.pushState(null, null, href);
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const menuItems = document.querySelectorAll('.menu a');

    function highlightActiveMenu() {
        let scrollY = window.scrollY;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; 
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        menuItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href').substring(1); 
            if (href === currentSectionId) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveMenu);
    window.addEventListener('load', highlightActiveMenu);

    const elementosParaRevelar = document.querySelectorAll('.secao, .card, .timeline-item, .card-estatistica, .recurso');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revelado');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px' 
    });

    elementosParaRevelar.forEach(el => {
        el.classList.add('revelar'); 
        observer.observe(el);
    });

    const estatisticasNumeros = document.querySelectorAll('.numero');

    // Função para animar contagem
    function animarNumero(elemento, valorFinal, duracao = 2000) {
        let valorInicial = 0;
        const incremento = valorFinal > 0 ? Math.ceil(valorFinal / (duracao / 16)) : 0; // 60fps approx
        const timer = setInterval(() => {
            valorInicial += incremento;
            if (valorInicial >= valorFinal) {
                elemento.textContent = valorFinal + (elemento.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                elemento.textContent = valorInicial + (elemento.textContent.includes('%') ? '%' : '');
            }
        }, 16);
    }

    const secaoEstatisticas = document.querySelector('#estatisticas');
    if (secaoEstatisticas) {
        const observerEstatisticas = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    estatisticasNumeros.forEach(numero => {
                        let texto = numero.textContent;
                        let valor = parseFloat(texto.replace(/[^0-9]/g, ''));
                        if (!isNaN(valor)) {
                            let temPorcentagem = texto.includes('%');
                            numero.textContent = '0' + (temPorcentagem ? '%' : '');
                            animarNumero(numero, valor, 2000);
                        }
                    });
                    observerEstatisticas.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observerEstatisticas.observe(secaoEstatisticas);
    }

    console.log('Site Mulheres Negras na Tecnologia carregado com sucesso!');
    console.log('Feito com dedicação para inspirar representatividade.');

}); 