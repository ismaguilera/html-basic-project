// ==========================================================================
// Configuración y Lógica del Contador de Lanzamiento
// ==========================================================================

// Establece la fecha y hora de lanzamiento (Año, Mes (0-11), Día, Hora, Minuto, Segundo)
const launchDate = new Date("May 16, 2025 11:30:00").getTime();

// Elementos del DOM para el contador
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const launchMessageEl = document.getElementById('launchMessage'); // Asumiendo que existe un elemento con este ID para el mensaje final
const subtitleTextEl = document.getElementById('subtitleText');

// Función para formatear el tiempo (agregar un cero al inicio si es menor que 10)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Función para actualizar el contador
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostrar los resultados en los elementos (con null checks)
    if (daysEl) daysEl.textContent = formatTime(days);
    if (hoursEl) hoursEl.textContent = formatTime(hours);
    if (minutesEl) minutesEl.textContent = formatTime(minutes);
    if (secondsEl) secondsEl.textContent = formatTime(seconds);

    // Si la cuenta regresiva termina
    if (distance < 0) {
        clearInterval(countdownInterval); // Detener el intervalo
        if (countdownEl) countdownEl.style.display = 'none'; // Ocultar el contador
        if (subtitleTextEl) subtitleTextEl.style.display = 'none'; // Ocultar el subtítulo
        if (launchMessageEl) launchMessageEl.style.display = 'block'; // Mostrar mensaje de lanzamiento

        // Asegurar que los valores se muestren como 00 al finalizar
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        // Mostrar el resto del contenido del sitio
        showWebsiteContent();
    }
}

// ==========================================================================
// Lógica de Visualización Inicial y Contenido del Sitio
// ==========================================================================

// Elementos del DOM relacionados con la estructura del sitio
const navElement = document.querySelector('nav');
const otherSections = document.querySelectorAll('main > section:not(#bienvenida)');
const footerElement = document.querySelector('footer');
const bienvenidaSection = document.getElementById('bienvenida');

// Función para mostrar el contenido normal del sitio (barra de navegación, secciones, pie de página)
function showWebsiteContent() {
    if (navElement) navElement.classList.remove('hidden');
    otherSections.forEach(section => section.classList.remove('hidden'));
    if (footerElement) footerElement.classList.remove('hidden');
    if (bienvenidaSection) {
        bienvenidaSection.classList.remove('min-h-screen');
        bienvenidaSection.classList.add('min-h-[calc(80vh-4rem)]'); // Restaurar altura original
    }
    // Restaurar el padding-top del body
    document.body.style.paddingTop = '4rem'; // O el valor original del navbar
}

// Función para ocultar el contenido normal del sitio (mostrar solo el contador)
function hideWebsiteContent() {
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
}


// Configurar la vista inicial de la página al cargar
function setInitialPageView() {
    const initialDistance = launchDate - new Date().getTime();
    
    if (initialDistance > 0) { // Si el contador está activo
        hideWebsiteContent();
    } else { // Si el contador ya terminó al cargar la página
        showWebsiteContent();
        // La lógica para ocultar el contador y mostrar mensaje de lanzamiento ya está en updateCountdown
    }
}


// ==========================================================================
// Lógica del Menú Móvil
// ==========================================================================

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        // Opcional: gestionar aria-hidden en mobileMenu
        mobileMenu.setAttribute('aria-hidden', isExpanded);
    });
}

// ==========================================================================
// Lógica de Desplazamiento Suave y Enlace de Navegación Activo
// ==========================================================================

const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-link'); // Obtiene todos los enlaces de navegación

// Intersection Observer para animaciones de sección y enlace de navegación activo
const observerOptions = {
    root: null, // relativo al viewport del documento
    rootMargin: '0px', // Sin margen
    threshold: 0.4 // Se activa cuando el 40% de la sección es visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        const targetId = entry.target.id;

        if (entry.isIntersecting) {
            // Añadir clase de visibilidad para la animación
            entry.target.classList.add('visible');

            // Actualizar el enlace de navegación activo para la sección correspondiente
            allNavLinks.forEach(link => {
                // Comprobar si el href del enlace termina con el ID de la sección intersectada
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('nav-active');
                } else {
                    link.classList.remove('nav-active'); // Eliminar de otros
                }
            });
        } else {
            // Opcional: Eliminar clase de visibilidad si quieres animación al hacer scroll hacia arriba también
            // entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observar todas las secciones
sections.forEach(section => {
    observer.observe(section);
});

// Desplazamiento Suave usando JavaScript para todos los enlaces de navegación
allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Comprobar si es un enlace de ancla interno
        if (href && href.startsWith('#')) {
            e.preventDefault(); // Prevenir el comportamiento predeterminado del ancla
            const targetId = href.substring(1); // Obtener el ID de destino (eliminar #)
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calcular el desplazamiento para la barra de navegación fija
                const navbarHeight = document.querySelector('nav')?.offsetHeight || 64; // Obtener la altura de la barra de navegación o usar un valor predeterminado
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                // Usar window.scrollTo para un desplazamiento suave con manejo de desplazamiento
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Cerrar el menú móvil si está abierto después de hacer clic en un enlace
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        }
        // Si no es un enlace de ancla interno (ej. enlace externo), permitir el comportamiento predeterminado
    });
});

// ==========================================================================
// Inicialización al Cargar la Página
// ==========================================================================

window.addEventListener('load', () => {
    // Configurar la vista inicial (mostrar contador o contenido del sitio)
    setInitialPageView();

    // Asegurar que las secciones inicialmente visibles en el viewport se animen
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Comprobar si la sección está dentro de los límites del viewport
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            section.classList.add('visible'); // Activar animación
        }
    });

    // Resaltar el enlace de navegación correcto basado en la posición de desplazamiento inicial
    let initialActiveFound = false;
    // Iterar secciones de abajo hacia arriba para encontrar la última lo suficientemente visible
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        // Comprobar si la parte superior de la sección está dentro del 60% superior del viewport
        if (rect.top <= window.innerHeight * 0.6) {
            allNavLinks.forEach(link => {
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('nav-active');
                    initialActiveFound = true;
                } else {
                    link.classList.remove('nav-active');
                }
            });
            break; // Detener después de encontrar la primera sección coincidente de abajo hacia arriba
        }
    }
    // Fallback: Si se desplaza completamente hacia arriba o ninguna sección cumplió los criterios anteriores, activar el primer enlace
    if (!initialActiveFound) {
        const firstNavLink = document.querySelector('.nav-link[href="#bienvenida"]'); // Apuntar al enlace 'bienvenida'
        if (firstNavLink) {
            allNavLinks.forEach(link => link.classList.remove('nav-active')); // Limpiar otros
            firstNavLink.classList.add('nav-active');
        }
    }
});
// Iniciar la actualización del contador cada segundo
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Llama para mostrar el estado inicial del contador

