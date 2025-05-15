// --- Configuración del Contador ---
// Establece la fecha y hora de lanzamiento (Año, Mes (0-11), Día, Hora, Minuto, Segundo)
// Ejemplo: 17 de mayo de 2025 a las 11:00:00 AM
const launchDate = new Date("May 17, 2025 11:30:00").getTime();

// Al inicio del script o en una función de inicialización
const navElement = document.querySelector('nav');
const otherSections = document.querySelectorAll('main > section:not(#bienvenida)');
const footerElement = document.querySelector('footer');
const bienvenidaSection = document.getElementById('bienvenida'); // Ya lo tienes
 // --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    /*mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });*/
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        // Opcional: gestionar aria-hidden en mobileMenu
        mobileMenu.setAttribute('aria-hidden', isExpanded); 
    });
}

// --- Intersection Observer for section animations and active nav link ---
const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-link'); // Get all nav links (desktop, mobile, and others like the hero arrow)

const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '0px', // No margin
    threshold: 0.4 // Trigger when 40% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        const targetId = entry.target.id;

        if (entry.isIntersecting) {
            // Add visibility class for animation
            entry.target.classList.add('visible');

            // Update active nav link for the corresponding section
            allNavLinks.forEach(link => {
                // Check if the link's href ends with the intersecting section's ID
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('nav-active');
                } else {
                    link.classList.remove('nav-active'); // Remove from others
                }
            });
        } else {
                // Optional: Remove visibility class if you want animation on scroll up too
                // entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// --- Smooth Scroll using JavaScript for all nav links ---
allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Check if it's an internal anchor link
        if (href && href.startsWith('#')) {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = href.substring(1); // Get the target ID (remove #)
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('nav')?.offsetHeight || 64; // Get navbar height or default
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                // Use scrollIntoView for smooth scroll (alternative to window.scrollTo)
                // targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Or use window.scrollTo for potentially better cross-browser offset handling
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });


                // Close mobile menu if open after clicking a link
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        }
        // If it's not an internal anchor link (e.g., external link), let the default behavior happen
    });
});


// --- Initial state setup on load ---
window.addEventListener('load', () => {
    // Ensure sections initially visible in the viewport get animated
        sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Check if section is within the viewport bounds
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
                section.classList.add('visible'); // Trigger animation
        }
        });

    // Highlight the correct nav link based on initial scroll position
    let initialActiveFound = false;
    // Iterate sections from bottom to top to find the last one visible enough
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
            // Check if the top of the section is within the top 60% of the viewport
        if (rect.top <= window.innerHeight * 0.6) {
                allNavLinks.forEach(link => {
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('nav-active');
                    initialActiveFound = true;
                } else {
                    link.classList.remove('nav-active');
                }
                });
                break; // Stop after finding the first matching section from the bottom up
        }
    }
        // Fallback: If scrolled to the very top or no section met the criteria above, activate the first link
    if (!initialActiveFound) {
            const firstNavLink = document.querySelector('.nav-link[href="#bienvenida"]'); // Target the 'bienvenida' link
            if (firstNavLink) {
            allNavLinks.forEach(link => link.classList.remove('nav-active')); // Clear others
            firstNavLink.classList.add('nav-active');
            }
    }
});


// Elementos del DOM
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const launchMessageEl = document.getElementById('launchMessage');
const subtitleTextEl = document.getElementById('subtitleText');

// Actualizar el contador cada segundo
const countdownInterval = setInterval(updateCountdown, 1000);
/*
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostrar los resultados en los elementos
    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);

    // Si la cuenta regresiva termina
    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownEl.style.display = 'none'; // Ocultar el contador
        if(subtitleTextEl) { // Comprobar si el elemento existe antes de modificarlo
                    subtitleTextEl.style.display = 'none'; // Ocultar el subtítulo
                }
        launchMessageEl.style.display = 'block'; // Mostrar mensaje de lanzamiento
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
    }
}
*/
// Función para formatear el tiempo (agregar un cero al inicio si es menor que 10)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Llamada inicial para evitar el retraso de 1 segundo al cargar
//updateCountdown();

function setInitialPageView(distance) {
    if (distance > 0) { // Si el contador está activo
        if (navElement) navElement.classList.add('hidden');
        otherSections.forEach(section => section.classList.add('hidden'));
        if (footerElement) footerElement.classList.add('hidden');

        // Asegurar que la sección de bienvenida esté visible y ajustada
        if (bienvenidaSection) {
            bienvenidaSection.classList.add('min-h-screen'); // Hacer que ocupe toda la pantalla
            bienvenidaSection.classList.remove('min-h-[calc(80vh-4rem)]'); // Quitar altura anterior si es necesario
        }
         // Ocultar el padding-top del body mientras solo se muestra el contador
        document.body.style.paddingTop = '0';

    } else { // Si el contador ya terminó al cargar la página
        if (navElement) navElement.classList.remove('hidden');
        otherSections.forEach(section => section.classList.remove('hidden'));
        if (footerElement) footerElement.classList.remove('hidden');
        if (bienvenidaSection) {
            bienvenidaSection.classList.remove('min-h-screen');
            bienvenidaSection.classList.add('min-h-[calc(80vh-4rem)]'); // Restaurar altura original
        }
        // Restaurar el padding-top del body
        document.body.style.paddingTop = '4rem'; // O el valor original del navbar
        // La lógica existente para ocultar el contador y mostrar mensaje de lanzamiento ya está en updateCountdown
    }
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    // ... (cálculos de tiempo y actualización de elementos del contador) ...
    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // (daysEl, hoursEl, etc. deben tener null checks como se menciona en Tarea 4.1)
    if (daysEl) daysEl.textContent = formatTime(days);
    if (hoursEl) hoursEl.textContent = formatTime(hours);
    if (minutesEl) minutesEl.textContent = formatTime(minutes);
    if (secondsEl) secondsEl.textContent = formatTime(seconds);


    if (distance < 0) {
        clearInterval(countdownInterval);
        if (countdownEl) countdownEl.style.display = 'none';
        if (subtitleTextEl) subtitleTextEl.style.display = 'none';
        if (launchMessageEl) launchMessageEl.style.display = 'block';

        // Restaurar valores a 00 si no están ya
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        // Mostrar el resto del contenido
        if (navElement) navElement.classList.remove('hidden');
        otherSections.forEach(section => section.classList.remove('hidden'));
        if (footerElement) footerElement.classList.remove('hidden');
        if (bienvenidaSection) {
            bienvenidaSection.classList.remove('min-h-screen');
            bienvenidaSection.classList.add('min-h-[calc(80vh-4rem)]'); // Restaurar altura
        }
        // Restaurar el padding-top del body
        document.body.style.paddingTop = '4rem'; // O el valor original del navbar

    }
}

// Llamada inicial para configurar la vista y evitar retraso
const initialDistance = launchDate - new Date().getTime();
setInitialPageView(initialDistance); // Configura la vista inicial
updateCountdown(); // Llama para iniciar el contador o mostrar mensaje si ya terminó
