document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion du Canvas des Étoiles (Background Stars) ---
    const canvas = document.getElementById('stars-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const numStars = 200; // Nombre d'étoiles

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5, // Taille des étoiles
                    speed: Math.random() * 0.1 + 0.05, // Vitesse de déplacement
                    opacity: Math.random() * 0.5 + 0.5 // Opacité
                });
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();

                star.y += star.speed; // Fait descendre les étoiles
                if (star.y > canvas.height) { // Si l'étoile sort de l'écran, la remonte
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                    star.radius = Math.random() * 1.5 + 0.5;
                    star.speed = Math.random() * 0.1 + 0.05;
                    star.opacity = Math.random() * 0.5 + 0.5;
                }
            });
            requestAnimationFrame(animateStars); // Boucle d'animation
        }

        resizeCanvas();
        initStars();
        animateStars();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initStars(); // Réinitialise les étoiles pour éviter les artefacts
        });
    }

    // --- Animation au défilement (Intersection Observer) ---
    const observerOptions = {
        root: null, // Regarde le viewport
        rootMargin: '0px',
        threshold: 0.1 // L'élément est visible à 10%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optionnel: pour animer une seule fois
            } else {
                // entry.target.classList.remove('is-visible'); // Optionnel: pour désanimer si hors de vue
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // --- Navigation fluide (Smooth Scrolling) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Ferme le menu mobile si ouvert
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu && mainMenu.classList.contains('active')) {
                    mainMenu.classList.remove('active');
                    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
                }
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajuste pour le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Menu Mobile (Toggle) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainMenu.classList.toggle('active');
        });
    }
});